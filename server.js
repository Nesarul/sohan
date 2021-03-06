const { ApolloServer, gql } = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { sequelize } = require('./models')


const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (ctx) => ctx,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
    sequelize.authenticate()
    .then(() => console.log("Database Connection Successful!!"))
    .catch(err => console.log(err));

});
