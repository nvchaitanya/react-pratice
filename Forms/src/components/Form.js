import React from 'react'
import uuid from 'react-uuid'
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
        }
    }
    handleChange=(e)=>{
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    handleSubmit=(e)=>{
      let formData={
        name:this.state.name,
        age:this.state.age,
        address:this.state.address,
        department:this.state.department,
        salary:this.state.salary,
        id:uuid()
      }
    }
    render(){
        return(
            <div className="container">
                <div className="col-10 offset-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label className="h5">Name</label>
                            <input type="text" name="name" value={this.state.name} onChange={this.handleChange} className="form-control" placeholder="Enter the Name"/>
                        </div>
                        <div className="form-group">
                            <label className="h5">Age</label>
                            <input type="number" name="age" value={this.state.age} onChange={this.handleChange} className="form-control" placeholder="Enter the Age"/>
                        </div>
                        <div className="form-group">
                            <label className="h5">Address</label>
                            <input type="text" name="address" value={this.state.address} onChange={this.handleChange} className="form-control" placeholder="Enter the Address"/>
                        </div>
                        <div className="form-group">
                            <label className="h5" placeholder="Select the Department">Department</label>
                            <select name="department" value={this.state.department} className="form-control">
                                <option value="--">-- Select --</option>
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
                            <input type="number" name="salary" value={this.state.salary} onChange={this.handleChange} className="form-control" placeholder="Enter the Salary"/>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default Form