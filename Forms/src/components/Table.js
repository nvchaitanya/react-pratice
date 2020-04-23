import React from 'react'

const PlotTable=(props)=>{
    return(
        <tr>
            <th>{props.name}</th>
            <th>{props.age}</th>
            <th>{props.address}</th>
            <th>{props.department}</th>
            <th>{props.salary}</th>
            <th><button className="btn btn-info px-3" onClick={()=>props.edit(props.id)}>Edit</button></th>
            <th><button className="btn btn-danger px-3" onClick={()=>props.delete(props.id)}>Delete</button></th>
        </tr>
    )
}

const Table = (props) => {
    return(
        <div className="container text-center">
            <select onClick={props.handleFilter} className="px-4 py-2 bg-warning my-2 mr-2 h5">
                <option value="">-- Select --</option>
                <option value="">All</option>
                <option value="ECE">ECE</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="OTHERS">others</option>
            </select>
            <select onClick={props.handleSort} className="px-4 py-2 bg-warning my-2 h5">
                <option value="--">-- Apply Sort --</option>
                <option value="asc">Ascending</option>
                <option value="des">Descending</option>
            </select>
            <div className="col-10 offset-1 col-md-12 offset-md-0 col-lg-12 table-responsive">
                <table className="table border">
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Address</th>
                            <th>Department</th>
                            <th>Salary</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.tabdata.map(element=><PlotTable  key={element.id} 
                                                                id={element.id} 
                                                                name={element.name} 
                                                                age={element.age}
                                                                address={element.address}
                                                                department={element.department}
                                                                salary={element.salary} 
                                                                edit={props.handleEdit}
                                                                delete={props.handleDelete}
                        />)}
                    </tbody>
                </table> 
            </div>
        </div>
    )
    
}
export default Table