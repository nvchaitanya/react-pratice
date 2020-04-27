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
            isrepo:false,
        }
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleSelect=(e)=>{
        (e.target.value==='repo')?this.setState({isrepo:true}):this.setState({isrepo:false})
    }

    handleSubmit=(e)=>{
        e.preventDefault()
        if(!this.state.isrepo){
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
        else{
            const {name,language} = this.state
            const requestParams = {
                method:'get',
                url:'https://api.github.com/search/repositories',
                params:{
                    q:name,
                    language:language
                }
            }
            axios(requestParams)
            .then(res=>{
                if(res){
                    const data = res.data.items.map(element=>element.owner)
                    this.setState({
                        userData:[...data],
                        isdata:true
                    })
                }
            })
        }
        this.reset()
    }

    reset=()=>{
        this.setState({
            name:'',
            language:'',
            // isrepo:false,
        })
    }
    render(){
        return(
            <div className="container">
                <h1 className="text-center my-3">GitHub User Search</h1>
                <div className="col-10 offset-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 my-3">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <select className="form-control" onClick={this.handleSelect} required>
                                <option value="">Search By</option>
                                <option value="user">UserName</option>
                                <option value="repo">Repository</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <input type="text" name="name" value={this.state.name} className="form-control" onChange={this.handleChange} placeholder="Search by username or Repo" required/>
                        </div>
                        {this.state.isrepo && 
                            <div className="form-group">
                                <input type="text" name="language" value={this.state.language} className="form-control" onChange={this.handleChange} placeholder="Search by Language" required/>
                            </div>
                        }
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