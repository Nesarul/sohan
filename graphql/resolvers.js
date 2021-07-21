const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { JWT_SECRET } = require('../config/env.json');
const { Op } = require ('sequelize');
module.exports = {
    Query: {
        getUsers: async (_, __, context) =>{
            
            try{
                let user
                if(context.req && context.req.headers.authorization){
                    const token = context.req.headers.authorization.split('Bearer ')[1];
                    jwt.verify(token,JWT_SECRET, (err,decodedToken) => {
                        if(err){
                            throw new AuthenticationError("Unauthenticated");
                        }
                        user = decodedToken;
                    }) 
                }

                const users = await User.findAll({
                   where: { email: {[Op.ne]: user.email}}
                })
                return users
            } catch(err){
                console.log(err)
                throw err;
            }
        },

        login: async(_,args) => {
            let{email,password} = args;
            let errors={};

            if(email.trim() === '') errors.email = "Email must not empty";
            try{
                const user = await User.findOne({
                    where: {email}
                });
                if(!user){
                    errors.email = "User Not Found or Invalid Email ID";
                    throw new UserInputError("Bad Input",{errors});
                }

                const correctPassword = await bcrypt.compare(password, user.password);
                if(!correctPassword){
                    errors.password = "Invalid Password";
                    throw new  UserInputError("Invalid Password", {errors});
                } 

                const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: 60 * 60 });
                return {
                    ...user.toJSON(),
                    createdAt:user.createdAt.toISOString(),
                    token
                }
            }catch(err){
                console.log(err);
                throw err;
            }
        },
    },

    Mutation: {
        registerUser: async(_,args) => {
            let{ firstName, lastName, email, password, confPassword} = args;
            let errors = {};
            
            try{
                if(firstName.trim() === '') errors.firstName = 'First Name cannot be empty';
                if(lastName.trim() === '') errors.lastName = 'Last Name cannot be empty';
                if(email.trim() === '' || email.indexOf('@') == -1) errors.email = 'Email cannot be empty or Invalid Email';
                if(password === '' | password != confPassword) errors.password = 'Password cannot be empty or Password and confirm password does ot match';
                
                password = bcrypt.hashSync(password, saltRounds);

                if(Object.keys(errors).length > 0)
                    throw errors;

                const user = await User.create({
                    id:uuidv4(),
                    firstName,
                    lastName,
                    email,
                    password
                });
                return user;
            }catch(err){
                console.log(err);
                if(err.name === 'SequelizeUniqueConstraintError'){
                    err.errors.forEach(
                        (e) => (errors[e.path] = `${e.path} : ${e.value} is alrady taken`)
                    );
                } else if(err.name === 'SequelizeValidationError'){
                    err.errors.forEach((e) => (errors[e.path] = e.message))
                }
                throw new UserInputError('Bad Input',{ errors });
            }
        }
    }
};