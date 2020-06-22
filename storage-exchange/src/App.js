import React,{ Component } from 'react'
import './App.css';
import RouteComp from './Router/router';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render(){
    return(
      <div id="app">
        <RouteComp/>
      </div>
    )
  }
}

export default App;