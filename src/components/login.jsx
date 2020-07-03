import React, { Component } from 'react';
import { loginMutation, getBooksQuery } from "../queries/queries";
import { graphql } from "react-apollo";







class Login extends Component {
    state={
        data: {
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
        const {data} = await this.props.loginMutation({
            variables: {
                email: this.state.data.email,
                password: this.state.data.password
            },
            refetchQueries: [{ query: getBooksQuery }]
        });
        console.log(data);
        localStorage.setItem("token", data.login.token);
        localStorage.setItem("user", data.login.user.name);
        this.props.history.push("/");
        
    }

   
    render() { 
        
    

        return ( 
            <div>
                <form className="login" onSubmit={this.handleSubmit} >
                <div>
                    <label id="label" htmlFor="email">Email</label>
                    <br />
                    <input onChange={this.handleChange} name="email" type="email" required /> 
                </div>
                <div>
                    <label id="label" htmlFor="password">Password</label>
                    <br />
                    <input onChange={this.handleChange} name="password" type="password" required /> 
                </div>
                <div>
                    <button type="submit">Login</button>
                </div>
                </form>
            </div>
         );
    }
}
 
export default graphql(loginMutation, {name: "loginMutation"})(Login);