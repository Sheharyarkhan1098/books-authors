import React, { Component } from 'react';
import { graphql } from "react-apollo";
import { getBookQuery } from "../queries/queries";

class BookDetails extends Component {
    

    getBookDetails(){
        const {book} = this.props.data;
        if(book){
            return (
                <div>
                    <h4>Name: {book.name}</h4>
                    <p>Genre: {book.genre}</p>
                    <p>Author name: {book.author.name}</p>
                    <p>Author age: {book.author.age}</p>
                </div>
            );
        } 
        else {
            return <h3>Book is loading or Book not Found</h3>
        }

    }
    
    render() { 
        return (
            <div>
            <h1> Book Details:</h1>
            {this.getBookDetails()}
            </div>
         );
    }
}
 
export default graphql(getBookQuery, { 
    options: (props) => {
        return {
            variables: {
                id: props.bookId
            }
        }
    }
})(BookDetails);