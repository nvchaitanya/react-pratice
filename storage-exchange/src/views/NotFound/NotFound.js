import React, { Component } from 'react';
import { CONFIG } from '../../Utils/config';
import './NotFound.css';
import { Link } from "react-router-dom";

class NotFound extends Component {
    constructor(props) {
        super(props);

        this.state = {
        
        };       
    }

    componentDidMount() {
      
    }

    goBack(){
        if (localStorage.getItem('accessKey')) {
            this.props.history.push({
                pathname: "/"
              });
        }else{
            this.props.history.push({
                pathname: "/"
              });
        }
    }

    render() {
        document.title = CONFIG.PAGE_TITLE + 'Page Not Found';
            return (
                <div>
                    <h2>Page Not Found!</h2>
                    <p>GO Back <Link onClick={()=> this.goBack()}>Home</Link></p>
                </div>
            );
        }
    }

export default NotFound;