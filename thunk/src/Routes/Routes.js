import React from 'react'
import { Route } from 'react-router-dom'
import Register from '../components/Register'
import Login from '../components/Login'
import Dashboard from '../components/Dashboard'

class Routes extends React.Component{
    render(){
        return(
            <div>
                <Route path = '/' exact render={(props) => <Login {...props}/>}/>
                <Route path='/register' render={() => <Register />}/>
                <Route path = '/dashboard' exact render={() => <Dashboard />}/>
            </div>
        )
    }
}
export default  Routes