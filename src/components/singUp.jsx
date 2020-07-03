import React, { Component } from 'react';
import { signUpMutation, getBooksQuery } from "../queries/queries";
import { graphql } from "react-apollo";




class SignUp extends Component {
    state={
        data: {
        name: "",
        email: "",
        password: "",
        }
    }
    
    
    handleChange = event => {
        const {data}= {...this.state};
        data[event.target.name] = event.target.value;
        this.setState({data});
    }

    handleSubmit = async event => {
        event.preventDefault();
        const {data} = await this.props.signUpMutation({
            variables: {
                name: this.state.data.name,
                email: this.state.data.email,
                password: this.state.data.password
            },
            refetchQueries: [{ query: getBooksQuery }]
        });
        localStorage.setItem("token", data.signUp.token);
        localStorage.setItem("user", data.user.name);
        this.props.history.push("/");
    }

   
    render() { 
        
    

        return ( 
            <div>
                <form className="sign-up" onSubmit={this.handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <br />
                    <input onChange={this.handleChange} name="name" required /> 
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <br />
                    <input onChange={this.handleChange} name="email" type="email" required /> 
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <br />
                    <input onChange={this.handleChange} name="password" type="password" required /> 
                </div>
                <div>
                    <button type="submit">Sign Up</button>
                </div>
                </form>
            </div>
         );
    }
}
 
export default graphql(signUpMutation, {name: "signUpMutation"})(SignUp);