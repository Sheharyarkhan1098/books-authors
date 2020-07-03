import React, {Component} from 'react';
import BookList from './bookList';

import NavBar from "./navbar";



class Home extends Component {
    state = {  
        user: "",
    }

    componentDidMount(){
       const user =  localStorage.getItem('user');
        this.setState({user});
    }
    render() { 
       ;
        return ( 
            <div className="main">
        <NavBar />
      <h2> List of Books!</h2>
      <BookList />
      
     </div>
         );
    }
}
 
export default Home;

