import React from 'react'
const Todolist=(props)=>{
    let headcolor=(props.label==="ToDo List")?"text-success font-weight-bold":'text-primary font-weight-bold'
    return(
        <div className="text-center my-2">
            <h3 className={headcolor}>{props.label}</h3>
            {props.data.map((element)=>
                <div className="row" key={element.id}>
                    <div className="col-12 col-md-10 col-lg-6 offset-lg-3">
                        <div className="card bg-warning">
                            <div className="d-flex py-1">
                                <div className="col-md-4">
                                    <input type="checkbox" onClick={()=>props.handleDone(element.id)}/>
                                </div>
                                <div className="col-md-4">
                                    <h4 style={{color:`${element.isdone?"green":"black"}`,
                                                textDecoration:`${element.isdone?"line-through":""}`}}>
                                                {element.task}
                                    </h4>
                                </div>
                                <div className="col-md-4">
                                    <button className="btn btn-danger" onClick={()=>props.handleDel(element.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Todolist