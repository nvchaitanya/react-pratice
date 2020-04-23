import React from 'react'
import uuid from 'react-uuid'
import Table from './Table'

class Form extends React.Component{
    constructor(props){
        super(props)
        this.state={
            name:'',
            age:'',
            address:'',
            department:'',
            salary:'',
            isdata:'',
            userData:[],
            filterData:[],
            isdata:false,
            isedit:false,
            id:null,
        }
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    handleSubmit=(e)=>{
      e.preventDefault()
      let formData={
        name:this.state.name,
        age:this.state.age,
        address:this.state.address,
        department:this.state.department,
        salary:this.state.salary,
        id:uuid()
      }
      this.setState({
        userData:[...this.state.userData,formData],
        filterData:[...this.state.filterData,formData],
        isdata:true
      })
      let localData=[...this.state.userData,formData]
      localStorage.setItem('data',JSON.stringify(localData))
      this.reset()
    }

    performEdit=(id)=>{
        let user = this.state.userData.find(element=>element.id===id)
        this.setState({
            name:user.name,
            age:user.age,
            address:user.address,
            department:user.department,
            salary:user.salary,
            id:user.id,
            isedit:true
        })
    }

    handleUpdate=(e)=>{
        e.preventDefault()
        let formData={
            name:this.state.name,
            age:this.state.age,
            address:this.state.address,
            department:this.state.department,
            salary:this.state.salary,
            id:this.state.id
        }
        const {filterData,id}=this.state
        const newData=filterData.map(element=>{
            if(element.id===id){
                return formData
            }
            return element
        })
        this.setState({
            userData:newData,
            filterData:newData,
            isdata:true,
            isedit:false
        })
        localStorage.setItem('data',JSON.stringify(newData))
        this.reset()
    }

    performDelete=(id)=>{
        let del = this.state.userData.filter(element=>element.id !== id)
        this.setState({
            filterData:[...del],
            userData:[...del]
        })
        localStorage.setItem('data',JSON.stringify(del))
    }

    performFilter=(e)=>{
        (e.target.value==='')
                    ?
        this.setState({filterData:this.state.userData.filter(element=>element)})
                    :
        this.setState({filterData:this.state.userData.filter(element=>element.department===e.target.value)})
    }

    performSort=(e)=>{
        (e.target.value==='asc')
                    ?
        this.setState({filterData:this.state.filterData.sort((a,b)=>Number(a.salary)-Number(b.salary))})
                    :
        this.setState({filterData:this.state.filterData.sort((a,b)=>Number(b.salary)-Number(a.salary))})

    }
    
    componentDidMount(){
        if(localStorage.getItem('data')){
            this.setState({
                userData:JSON.parse(localStorage.getItem('data')),
                filterData:JSON.parse(localStorage.getItem('data')),
                isdata:true
            })
        }
    }

    reset=()=>{
      this.setState({
        name:'',
        age:'',
        address:'',
        department:'',
        salary:''
      })
    }

    render(){
        let buttonName=(this.state.isedit)?"UPDATE":"SUBMIT"
        let submitFunc=(this.state.isedit)?this.handleUpdate:this.handleSubmit
        return(
            <div className="container">
              <h1 className="text-center text-primary shadow-lg my-2">Employee Data Form</h1>
                <div className="col-10 offset-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 border py-4 my-4 shadow-lg">
                    <form onSubmit={submitFunc}>
                        <div className="form-group">
                            <label className="h5">Name</label>
                            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="form-control" placeholder="Enter the Name" required/>
                        </div>
                        <div className="form-group">
                            <label className="h5">Age</label>
                            <input type="number" name="age" value={this.state.age} onChange={this.handleChange} className="form-control" placeholder="Enter the Age" required/>
                        </div>
                        <div className="form-group">
                            <label className="h5">Address</label>
                            <input type="text" name="address" value={this.state.address} onChange={this.handleChange} className="form-control" placeholder="Enter the Address" required/>
                        </div>
                        <div className="form-group">
                            <label className="h5">Department</label>
                            <select name="department" value={this.state.department} className="form-control" onChange={this.handleChange} required>
                                <option value="">-- Select --</option>
                                <option value="ECE">ECE</option>
                                <option value="CSE">CSE</option>
                                <option value="IT">IT</option>
                                <option value="MECH">MECH</option>
                                <option value="CIVIL">CIVIL</option>
                                <option value="OTHERS">others</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="h5">Salary</label>
                            <input type="number" name="salary" value={this.state.salary} onChange={this.handleChange} className="form-control" placeholder="Enter the Salary" required/>
                        </div>
                        <div className="text-center">
                            <input type="submit" value={buttonName} className="btn btn-primary rounded-pill"/>
                        </div>
                    </form>
                </div>
                {this.state.isdata && <Table  tabdata={this.state.filterData}
                                              handleEdit={this.performEdit}
                                              handleDelete={this.performDelete}
                                              handleFilter={this.performFilter}
                                              handleSort={this.performSort}/>}
            </div>
        )
    }
}
export default Form