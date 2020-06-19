import React from 'react'
import uuid from 'react-uuid'
import { Link } from 'react-router-dom'

class SignUp extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            name:'',
            username:'',
            password:'',
            userData:[],
            isdata:false
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleSubmit= (e) => {
        e.preventDefault()
        let {name,username,password} = this.state
        if(name ==='' || username==='' || password==='') 
            alert('Please fill all the fields')
        else{
            let userObj={
                name:this.state.name,
                username:this.state.username,
                password:this.state.password,
                id:uuid()
            }
            if(this.state.userData.length){
                this.state.userData.map(element => {
                    if(element.username !== userObj.username){
                        this.setState({
                            userData:[...this.state.userData,userObj],
                            isdata:true
                        })
                        let localData = [...this.state.userData,userObj]
                        localStorage.setItem('signupData',JSON.stringify(localData))
                        alert('Successfully registered')
                    }else{
                        alert('User alredy exists')
                    }
                })
            }
            else{
                this.setState({
                    userData:[...this.state.userData,userObj],
                    isdata:true
                })
                let localData = [...this.state.userData,userObj]
                    localStorage.setItem('signupData',JSON.stringify(localData))
                    alert('Successfully registered...Proceed to Login')
                    this.props.history.push('/login')
            }
            this.reset()
        }
    }

    componentDidMount(){
        if(localStorage.getItem('signupData')){
            this.setState({
                userData:JSON.parse(localStorage.getItem('signupData')),
                isdata:true
            })
        }
    }

    reset=() => {
        this.setState({
            name:'',
            username:'',
            password:''
        })
    }

    render(){
        return(
            <div className='container'>
                <h2 className="text-center text-success font-weight-bold my-3">SignUp Page</h2>
                <div className='col-10 offset-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 my-3 border shadow rounded py-3'> 
                    <form onSubmit={this.handleSubmit}>
                        <div className="my-3">
                            <label className="h5">Name</label>
                            <input type="text" 
                                   name="name" 
                                   value={this.state.name} 
                                   onChange={this.handleChange} 
                                   className="form-control" 
                                   placeholder="Enter Name"/>
                        </div>
                        <div className="my-3">
                            <label className="h5">Username</label>
                            <input type="text" 
                                   name="username" 
                                   value={this.state.username} 
                                   onChange={this.handleChange} 
                                   className="form-control" 
                                   placeholder="Enter email"/>
                        </div>
                        <div className="my-3">
                            <label className="h5">Password</label>
                            <input type="text" 
                                   name="password" 
                                   value={this.state.password} 
                                   onChange={this.handleChange} 
                                   className="form-control" 
                                   placeholder="Enter Password"/>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-success">SignUp</button>
                        </div>
                        <div className='text-center my-2'>
                            <small>Already signed up ? Proceed to 
                                <Link to='/login'>Login</Link>
                            </small>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}

export default SignUp