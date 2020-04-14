import React from 'react'
import uuid from 'react-uuid'
import Add from './components/Add'
import Todolist from './components/Todolist'

class App extends React.Component{
    constructor(props){
        super(props)
        this.state={
            todo:[],
            isdata:false,
            iscompleted:false,
        }
    }

    handleSubmit=(itemname)=>{
        let item={
            task:itemname,
            isdone:false,
            id:uuid(),
        }
        this.setState({
            todo:[...this.state.todo,item],
            isdata:true
        })
    }

    handleCheck=(id)=>{
        this.setState({
            todo:this.state.todo.map(element=>element.id===id?{...element,isdone:!element.isdone}:element)
        })
    }

    performDel=(id)=>{
        this.setState({
            todo:this.state.todo.filter(element=>element.id!==id)
        })
    }

    render(){
        return(
            <div className="container text-center">
                <Add  parentFunc={this.handleSubmit}/>
                {this.state.isdata && <Todolist data={this.state.todo}
                                                handleDone={this.handleCheck}
                                                handleDel={this.performDel}
                                                label="ToDo List"/>}
                {this.state.isdata && <button className="btn btn-primary my-4" onClick={()=>this.setState({iscompleted:!this.state.iscompleted})}>Show Completed Todo's</button>}
                {this.state.iscompleted && <Todolist data={this.state.todo.filter(element=>element.isdone)}
                                                     handleDone={this.handleCheck}
                                                     handleDel={this.performDel}
                                                     label="Completed Todo's"/>}
            </div>
        )
    }
}
export default App