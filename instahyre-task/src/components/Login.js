import React from 'react'

class Login extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            username:'',
            password:'',
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        let data = JSON.parse(localStorage.getItem('signupData'))
        let authData = data.filter(element => element.username===this.state.username)
        console.log(authData)
        if(authData.length){
            if(authData[0].username === this.state.username && authData[0].password === this.state.password){
                alert('Congratulations..You are successfully Logged In')
                localStorage.setItem('loggedUser',authData[0].username)
                this.reset()
                this.props.history.push('/home')
            }else{
                alert('Invalid password')
            }
        }
        else{
            alert('Invalid username or password')
        }
    }

    reset = () => {
        this.setState({
            username:'',
            password:''
        })
    }

    render(){
        return(
            <div className="container">
                <h2 className="text-center text-primary font-weight-bold my-3">Login Page</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className="col-10 offset-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 my-3 border shadow rounded py-3">
                        <div className="my-3">
                            <label>Username</label>
                            <input type="text" 
                                   name="username" 
                                   value={this.state.username} 
                                   onChange={this.handleChange} 
                                   className="form-control" 
                                   placeholder="Enter Username"/>
                        </div>
                        <div className="my-3">
                            <label>Password</label>
                            <input type="text" 
                                   name="password" 
                                   value={this.state.password} 
                                   onChange={this.handleChange} 
                                   className="form-control" 
                                   placeholder="Enter Password"/>
                        </div>
                        <div className='text-center'>
                            <button className='btn btn-primary'>Login</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
export default Login