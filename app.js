const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require("mongoose");
const cors = require("cors");
const { ApolloServer, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const {APP_SECRET} = require('./utils/utils');
const User = require("./models/user");

const app = express();


//allow cross platform requests
app.use(cors());

mongoose.connect('mongodb+srv://vidlyUser:test123@cluster0-6frq9.mongodb.net/graphql?retryWrites=true&w=majority');
mongoose.connection.once("open", ()=>{
    console.log("connected to database");
})


// app.use("/graphql", graphqlHTTP({
//     schema,
//     graphiql: true,
// }));



const server = new ApolloServer({
 schema,
 context: async ({ req }) => {
   // Note! This example uses the `req` object to access headers,
   // but the arguments received by `context` vary by integration.
   // This means they will vary for Express, Koa, Lambda, etc.!
   //
   // To find out the correct arguments for a specific integration,
   // see the `context` option in the API reference for `apollo-server`:
   // https://www.apollographql.com/docs/apollo-server/api/apollo-server/

   // Get the user token from the headers.
   const token = req.headers.authorization || '';

   // add the token to the context
   return { token };
 },
});

server.listen(4000).then(({ url }) => {
 console.log(`🚀 Server ready at ${url}`)
});

// app.listen(4000, () => {
//     console.log('listening requests on port 4000');
// });