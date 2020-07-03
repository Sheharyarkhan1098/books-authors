import React from 'react';
import './App.css';
import Home from "./components/home";
import Login from "./components/login";
import  ApolloClient  from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { Route } from "react-router-dom";
import SingUp from './components/singUp';
import AddBook from "./components/addBook";

// const client = new ApolloClient({
//   uri: "http://localhost:4000/graphql"
// });


const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  request: (operation) => {
    const token = localStorage.getItem('token')
    operation.setContext({
      headers: {
        Authorization: token ? token : ''
      }
    })
  }
})


function App() {
  return (
    <ApolloProvider client={client}>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SingUp} />
      <Route path="/addbook" component={AddBook} />
      <Route exact path="/" component={Home} />
    </ApolloProvider>
  );
}

export default App;
