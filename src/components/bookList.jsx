import React, { Component } from 'react';
import { getBooksQuery } from "../queries/queries";
import {graphql} from "react-apollo";
import BookDetails from "./bookDetails";





class BookList extends Component {
    state={
        bookId:""
    }
    
    getBooksData(){
        const {data} = this.props;
        if(data.loading){
            return <h5>Books are loading!!</h5>
        }
        else {
            if(data.books !== undefined){
            return data.books.map(book => {
                return(
                   <li key={book.id}><button key={book.id} onClick={() => {this.setState({bookId: book.id})}}>{book.name}</button></li>                  
                )
                    
            })
            }
            else {
                return <h5>No data!</h5>
            }
        }
    }
    
    render() { 
        const {bookId} = this.state;
        return (
            <div>
            
            <ul className="book-list">
                {this.getBooksData()}
            </ul>
            <div className="book-details">
            {bookId &&
            <BookDetails bookId={bookId} />
            }
            </div>
            </div>
         );
    }
}
 
export default graphql(getBooksQuery)(BookList);