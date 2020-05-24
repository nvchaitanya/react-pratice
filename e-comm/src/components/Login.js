import React from 'react'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state={
            username:'',
            password:'',

        }
    }
    render(){
        return(
            <div className="container">
                <div>
                    <label>UserName</label>
                    <input type="text" onChange={this.handleChange} className="form-control" placeholder="Enter username"/>
                </div>
                <div>
                    <label >Password</label>
                    <input type="password" onChange={this.handleChange} className="form-control" placeholder="Enter Password"/>
                </div>
                <div>
                    <label >Type</label>
                    <select onChange={this.handleChange} className="form-control">
                        <option value="--">-- Select --</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div>
                    <button onClick={this.handleClick} className="btn btn-outline-primary">Submit</button>
                </div>
            </div>
        )

    }
}
export default Login    