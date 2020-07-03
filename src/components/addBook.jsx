import React, { Component } from 'react';
import { getAuthorsQuery, addBookMutation, getBooksQuery } from "../queries/queries";
import { graphql } from "react-apollo";
import {flowRight as compose} from 'lodash';



class AddBook extends Component {
    state={
        data: {
        name: "",
        genre: "",
        authorId: "",
        }
    }
    
    
    handleChange = event => {
        const {data}= {...this.state};
        data[event.target.name] = event.target.value;
        this.setState({data});
    }

    handleSubmit = event => {
        event.preventDefault();
        this.props.addBookMutation({
            variables: {
                name: this.state.data.name,
                genre: this.state.data.genre,
                authorId: this.state.data.authorId
            },
            refetchQueries: [{ query: getBooksQuery }]
        });
        this.props.history.push("/");
    }


    getAuthorData(){
        const {getAuthorsQuery: data} = this.props;
        console.log(data);
        if(data.loading){
            return <option disabled>Loading authors!</option>
        } 
        else {
            if(data.authors !== undefined){
            return data.authors.map(author => {
                return (
                    <option key={author.id} value={author.id}>{author.name}</option>
                )
            })
            }
            else{
                return <option>no data!</option>
            }
        }
    };

   
    render() { 
        
    

        return ( 
            <div>
                <form className="add-Book" onSubmit={this.handleSubmit}>
                <div>
                    <label id="label" htmlFor="name">Name</label>
                    <br />
                    <input onChange={this.handleChange} name="name" required /> 
                </div>
                <div>
                    <label id="label" htmlFor="genre">Genre</label>
                    <br />
                    <input onChange={this.handleChange} name="genre" required /> 
                </div>
                <div>
                    <label id="label" htmlFor="authorId">Author</label>
                    <br />
                    <select onChange={this.handleChange} name="authorId" required defaultValue={'default'}>
                        <option disabled value="default">Select Author</option>
                        {this.getAuthorData()}
                    </select>
                </div>
                <div>
                    <button type="submit">Add Book</button>
                </div>
                </form>
            </div>
         );
    }
}
 
export default compose(
    graphql(getAuthorsQuery, {name: "getAuthorsQuery"}),
    graphql(addBookMutation, {name: "addBookMutation"})
)(AddBook);