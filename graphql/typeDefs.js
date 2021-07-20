const { gql } = require('apollo-server');

module.exports = gql`
    type User {
        id:ID,
        firstName:String,
        lastName:String,
        email:String,
        password:String
        createdAt: String
        token: String
    }

    type Query {
       getUsers: [User]
       login(email:String, password:String): User
    }
    
    type Mutation{
        registerUser(
            firstName: String,
            lastName: String,
            email: String,
            password: String,
            confPassword: String,
        ): User
    }
`;