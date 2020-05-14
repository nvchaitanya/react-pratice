import React from 'react'
import { connect } from 'react-redux'
import {addNewTodo,delToDo,toggle,count} from './components/Redux/Action'
import uuid from 'react-uuid'
import Total from './components/Total'

export class App extends React.Component{
    constructor(props){
        super(props)
        this.state={
            new:''
        }
    }

    handleChange = (e) => {
        this.setState({
            new:e.target.value
        })
    }

    handleClick = () => {
        let newTodo = {
            title:this.state.new,
            completed:false,
            id:uuid()
        }
        this.props.addNewTodo(newTodo)
        this.props.count()
    }

    handleToggle = (id) => {
        this.props.toggle(id)
        this.props.count()
    }

    handleDel =  (id) => {
        this.props.delToDo(id)
        this.props.count()
    }

    render(){
        return(
            <div className="container p-5 text-center w-25">
                <h3>To-Do App</h3>
                <div className="d-flex justify-content-center my-2">
                    <input type="text" value={this.state.new} onChange={this.handleChange} className="form-control" placeholder="Add New ToDo"/>
                    <button onClick={this.handleClick} className="btn btn-outline-warning">ADD</button>
                </div>

                <div className="p-2">
                    {this.props.todo.map(element =>
                        <div className="d-flex justify-content-between my-1" key={element.id}>
                            <div onClick={() => this.handleToggle(element.id)} style={{color : element.completed ? "green":"black" , textDecoration: element.completed ? "line-through" : ""}}>{element.title}</div>
                            <button onClick={() => this.handleDel(element.id)} className={element.completed ? "btn btn-outline-danger" : "btn btn-danger"}>Delete</button>
                        </div>
                    )}
                </div>
                <Total />
            </div>
        )
    }
}
// export default App
const mapStateToProps = (state) => ({
    todo:state.todo
})

const mapDispatchToProps = (dispatch) => ({
    addNewTodo: (payload) => dispatch(addNewTodo(payload)),
    toggle : (payload) => dispatch(toggle(payload)),
    delToDo: (payload) => dispatch(delToDo(payload)),
    count : (payload) => dispatch(count(payload))
})

export default connect(mapStateToProps,mapDispatchToProps)(App)
