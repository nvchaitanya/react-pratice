import React from 'react'
import axios from 'axios'
import SearchTable from './SearchTable'
import RepoTable from './RepoTable'
import './style.css'

class User extends React.Component{
    constructor(props){
        super(props)
        this.state={
            name:'',
            language:'',
            userData:[],
            repoData:[],
            isSearchData:false,
            isRepoData:false,
            isrepo:false,
            isLoading:false,
        }
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleSelect=(e)=>{
        (e.target.value==='repo')
                    ?
        this.setState({isrepo:true,isSearchData:false,isRepoData:false})
                    :
        this.setState({isrepo:false,isSearchData:false,isRepoData:false})
    }

    handleSubmit=(e)=>{
        e.preventDefault()
        this.setState({
            isLoading:true
        })

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
                        isSearchData:true,
                        isLoading:false,
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
                    language:language,
                }
            }
            axios(requestParams)
            .then(res=>{
                if(res){
                    const data = res.data.items
                    this.setState({
                        repoData:[...data],
                        isRepoData:true,
                        isLoading:false
                    })
                    // console.log(data)
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
                <h1 className="text-center border px-5 py-1 bg-color text-light display-4 rounded my-1"><i>GitHub User Search</i></h1>
                <div className="col-10 offset-1 col-md-8 offset-md-2 col-lg-8 offset-lg-2 my-3">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <select name="searchBy" value={this.state.searchBy} className="form-control" onClick={this.handleSelect} required>
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
                {this.state.isLoading &&    <div class="text-center my-3">
                                                <div class="spinner-grow text-muted"></div>
                                                <div class="spinner-grow text-primary"></div>
                                                <div class="spinner-grow text-success"></div>
                                                <div class="spinner-grow text-info"></div>
                                                <div class="spinner-grow text-warning"></div>
                                                <div class="spinner-grow text-danger"></div>
                                                <div class="spinner-grow text-secondary"></div>
                                                <div class="spinner-grow text-dark"></div>
                                                <div class="spinner-grow text-light"></div>
                                            </div> 
                }
                {!this.state.isLoading && this.state.isSearchData && <SearchTable tabdata={this.state.userData}/>}
                {!this.state.isLoading && this.state.isRepoData && <RepoTable repo={this.state.repoData}/>}
            </div>
        )
    }
}
export default User