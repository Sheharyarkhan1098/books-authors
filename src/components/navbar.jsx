import React, { Component } from 'react';
import { Link } from "react-router-dom"

class NavBar extends Component {
    state = { user: ""  }
    componentDidMount(){
        const user =  localStorage.getItem('user');
         this.setState({user});
     }
    handleClick = () => {
        localStorage.clear();
        window.location.reload("/");
    }
    render() { 
         const {user} = this.state;
        return ( 
            <div className="navbar">
                {user === null && 
                <>
                <div className="nav-text">
                <h4> Login or Sign Up to add new Books!</h4>
                </div>
                <div className="nav-buttons">
                <Link to="/login"><button>Login</button></Link>
                <Link to="/signup"><button>Sign Up</button></Link>
                </div>
                </>
                }
                {user !== null && 
                <>
                <div className="nav-text">
                    <h4>Welcome "{user}" :) </h4>
                </div>
                <div className="nav-buttons">
                <button onClick={this.handleClick}>Logout</button>
                <Link to="/addBook"><button>Add book</button></Link>
                </div>
                </>
                }
            </div>
         );
    }
}
 
export default NavBar;