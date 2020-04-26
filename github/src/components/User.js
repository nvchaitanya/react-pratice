import React from 'react'
import axios from 'axios'
import Table from './Table'

class User extends React.Component{
    constructor(props){
        super(props)
        this.state={
            name:'',
            language:'',
            userData:[],
            isdata:false,
            isrepo:false
        }
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    
    handleSubmit=(e)=>{
        e.preventDefault()
        const {name}=this.state
        const requestParams={
            method:'get',
            url:'https://api.github.com/search/users',
            params:{
                q:name
            }
        }
        axios(requestParams)
        .then(res=>{
            if(res){
                const data = res.data.items
                this.setState({
                    userData:[...data],
                    isdata:true
                })
            }
        })
        .catch(error=>console.log(error))
    }
    render(){
        return(
            <div className="container">
                <h1 className="text-center my-3">GitHub User Search</h1>
                <div className="col-10 offset-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 my-3">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <select className="form-control">
                                <option value="--">Search By</option>
                                <option value="user">UserName</option>
                                <option value="repo">Repository</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input type="text" name="name" className="form-control" onChange={this.handleChange} placeholder="Search by username or Repo"/>
                        </div>
                        <div className="form-group">
                            <input type="text" name="language" className="form-control" onChange={this.handleChange} placeholder="Search by Language"/>
                        </div>
                        <div className="text-center">
                            <button className="btn btn-primary">SUBMIT</button>
                        </div>
                    </form>
                </div>
                {this.state.isdata && <Table tabdata={this.state.userData}/>}
            </div>
        )
    }
}
export default User