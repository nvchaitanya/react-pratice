import React from 'react'
import store from './store'
import {add_counter , dec_counter} from './action'

class App extends React.Component{
    render(){
        return(
            <div>
                <h1>count : {store.getState().count}</h1>
                <button onClick={() => store.dispatch(add_counter(1))}>Increment</button>
                <button onClick={() => store.dispatch(dec_counter(1))}>Decrement</button>
            </div>
        )
    }
}
export default App