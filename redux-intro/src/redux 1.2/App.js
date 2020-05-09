import React from 'react'
import store from './store'
import {ActionCreator} from './action'

class App extends React.Component{
    constructor(props){
        super(props)
        this.state={
            number:0
        }
    }
    render(){
        return(
            <div>
                <h1>Count : {store.getState().count}</h1>
                <input type="text" onChange={(e) => this.setState({number:e.target.value})}/>
                <button onClick={()=>store.dispatch(ActionCreator(this.state.number))}>set counter</button>
            </div>
        )
    }
}
export default App