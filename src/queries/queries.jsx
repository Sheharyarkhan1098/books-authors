import {gql} from "apollo-boost";


const getBooksQuery = gql`
    {
        books{
            name
            id
        }
    }
`
const getBookQuery = gql`
    query($id: ID!){
        book(id: $id){
            name
            genre
            author{
                name
                age
            }
        }
    }
`

const getAuthorsQuery = gql`
    {
        authors{
            name
            id
        }
    }
`
const addBookMutation = gql`
    mutation($name: String!, $genre: String!, $authorId: ID!){
        addBook(name: $name,genre: $genre, authorId: $authorId){
            name
            id
        }
    }
`
const loginMutation = gql`
    mutation($email: String!, $password: String!){
        login(email: $email, password: $password){
            token,
            user{
                id
                name
            }
        }
    }
`
const signUpMutation = gql`
mutation($name: String!,$email: String!, $password: String!){
    signUp(name: $name, email: $email, password: $password){
        token,
        user{
            id
            name
        }
    }
}
`

export {
    getBooksQuery,
    getBookQuery,
    getAuthorsQuery,
    addBookMutation,
    loginMutation,
    signUpMutation
}
