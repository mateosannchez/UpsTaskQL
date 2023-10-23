const { ApolloServer} = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const jwt = require('jsonwebtoken')
require("dotenv").config('variables.env');
// const conectarDB = require('./config/db');

// conectarDB();

const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({req}) => {
        const token = req.headers['authorization'] || ''
        if (token) {
            try {
                const usuario = jwt.verify(token.replace('Bearer', ''), process.env.SECRETA);
                return {
                    usuario
                }
            } catch (error) {
                
            }
        }
    }
});

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
})