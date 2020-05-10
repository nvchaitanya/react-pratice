import React from 'react'
import store from './redux/store'
import {increment,decrement,ActionCreator,mul,div,modulo} from './redux/action'

class App extends React.Component{
    constructor(props){
        super(props)
        this.state={
            number: 0
        }
    }
    render(){
        return(
            <div className ="container">
                <h1 className="text-center text-primary">Result : {store.getState().count}</h1>
                <input type="text" className="form-control" onChange={(e) => {this.setState({number:e.target.value})}}/>
                <div className="text-center my-3">
                    <button onClick={() => store.dispatch(increment(1))} className="btn btn-primary text-light btn-outline-dark mr-2">Increment</button>
                    <button onClick={() => store.dispatch(decrement(1))} className="btn btn-primary text-light btn-outline-dark mr-2">Decrement</button>
                    <button onClick={() => store.dispatch(ActionCreator(this.state.number))} className="btn btn-primary text-light btn-outline-dark mr-2">Even or Odd</button>
                    <button onClick={() => store.dispatch(mul(this.state.number))} className="btn btn-primary text-light btn-outline-dark mr-2">Multiply</button>
                    <button onClick={() => store.dispatch(div(this.state.number))} className="btn btn-primary text-light btn-outline-dark mr-2">Divide</button>
                    <button onClick={() => store.dispatch(div(this.state.number))} className="btn btn-primary text-light btn-outline-dark mr-2">Divide</button>
                    <button onClick={() => store.dispatch(modulo(this.state.number))} className="btn btn-primary text-light btn-outline-dark mr-2">Remainder</button>
                </div>
            </div>
        )
    }
}
export default App