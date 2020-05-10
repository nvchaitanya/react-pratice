import React from 'react'
import ReactDOM from 'react-dom'
// import {BrowserRouter} from 'react-router-dom'
import App from './App'
import store from './redux/store'

// ReactDOM.render(
//         <BrowserRouter>
//                 <App />
//         </BrowserRouter>,document.getElementById('root')
//         )
const render = ()=>ReactDOM.render(<App/>,document.getElementById('root'))
render()
store.subscribe(render)