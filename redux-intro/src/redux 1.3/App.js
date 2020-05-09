import React from 'react'
import store from './store'
import {mul,div,remainder} from './action'

class App extends React.Component{
    constructor(props){
        super(props)
        this.state={
            number : 0
        }
    }
    render(){
        return(
            <div>
                <h1>Result : {store.getState().count}</h1>
                <input onChange = {(e) => this.setState({number: e.target.value})}/>
                <button onClick = {() => store.dispatch(mul(this.state.number))}>Multiply</button>
                <button onClick = {() => store.dispatch(div(this.state.number))}>Divide</button>
                <button onClick = {() => store.dispatch(remainder(this.state.number))}>Remainder</button>
            </div>
        )
    }
}
export default App