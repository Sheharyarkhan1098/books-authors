const graphql = require("graphql");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const { AuthenticationError } = require('apollo-server');
const { APP_SECRET, getUserId } = require("../utils/utils");
const bcrypt = require("bcryptjs");
const Book = require("../models/book");
const Author = require("../models/author");
const User = require("../models/user");
const { request, response } = require("express");



const { 
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID, 
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    } = graphql;

//dummy data
// var books = [
//     {name: "Name of the wind", genre: "Fantasy", id: "1", authorId: "1"},
//     {name: "The Final Empire", genre: "Fantasy", id: "2", authorId: "2"},
//     {name: "The Long Earth", genre: "Sci-Fi", id: "3", authorId: "3"},
//     {name: "The Hero of Ages", genre: "Sci-Fi", id: "4", authorId: "2"},
//     {name: "The Color of Magic", genre: "Comedy", id: "5", authorId: "3"},
//     {name: "The light Fantastic", genre: "Comedy", id: "6", authorId: "1"},
// ];

// var authors = [
//     {name: "Patrick Rothfuss", age: 44, id: "1"},
//     {name: "Brandon Sanderson", age: 42, id: "2"},
//     {name: "Terry Pratchett", age: 66, id: "3"},
    
// ];

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
               //return _.filter(books, {authorId: parent.id});
                return Book.find({authorId: parent.id});
            }
        }
    })
});




const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                //return _.find(authors, {id: parent.authorId});
                return Author.findById(parent.authorId);
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: "UserType",
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        password: {type: GraphQLString},
        email: {type: GraphQLString},
    })
});




const AuthPayLoadType = new GraphQLObjectType({
    name: "AuthPayLoadType",
    fields: () => ({
        token: {type: GraphQLString},
        user: {
            type: UserType
        }
    })
})



const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        book: {
            type: BookType, 
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //code to get data from db
               //return _.find(books, {id: args.id});
               return Book.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args){
                //return _.find(authors, {id: args.id});
                return Author.findById(args.id);
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find({});
            }
        },
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)} 
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        }, 
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)},
                // addedBy: {type: new GraphQLNonNull(GraphQLID)},
            },
            async resolve(parent, args, context){
                const {token} = context;
                //decode token
                if(token !== ""){
                    const { userId } = jwt.verify(token, APP_SECRET);
                    // try to retrieve a user with the token
                    const user = await User.findById(userId);
                    if (!user) throw new AuthenticationError('Not authenticated');
                    }else 
                    {throw new AuthenticationError('You must login!');                   
                    }
    
                let books = new Book({
                name: args.name,
                genre: args.genre,
                authorId: args.authorId,
            });
            return books.save();
            }
        },
        login:{
            type: AuthPayLoadType,
            args: {
                password: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parents, args){
            const user = await User.findOne({"email": args.email});
            let token = "";
            const valid = await bcrypt.compare(args.password, user.password);
            if(valid){
                token = jwt.sign({userId: user.id }, APP_SECRET);
                // token = user.name;
            }else {
                throw new Error ("invalid password or email!");
            }
            
            return {
                token,
                user
            }

        }},
        signUp: {
            type: AuthPayLoadType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                password: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parents, args){
                const hashedPassword = await bcrypt.hash(args.password, 10);
                let userdata = new User({
                    name: args.name,
                    password: hashedPassword,
                    email: args.email, 
                });
                await userdata.save();
                const user = await User.findOne({"email": args.email});
                console.log(user);
                const token = jwt.sign({ userId: user.id }, APP_SECRET) 
                return {
                    token,
                    user
                }
            }
        }
        
    }    
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation 
})