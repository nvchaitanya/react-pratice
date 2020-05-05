import React from "react";
import {store} from './Redux/store'
import {addCounter,reduceCounter} from './Redux/action'

export default class App extends React.Component{
  componentDidMount(){
    store.subscribe(()=> this.forceUpdate())
  }
  render(){
    return (
      <div>
        <h1>count</h1>
        <h2>{store.getState()}</h2>
        <button onClick={()=>store.dispatch(addCounter(1))}>ADD</button>
        <button onClick={()=>store.dispatch(reduceCounter(1))}>REDUCE</button>
      </div>
    );
  }
}
