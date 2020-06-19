import React from 'react'
import { Route,Switch } from 'react-router-dom'
import SignUp from '../components/SignUp'
import Login from '../components/Login'
import Home from '../components/Home'

class Routes extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Switch>
                    <Route path='/' exact render={(props) => <SignUp {...props}/>} />
                    <Route path='/login' render={(props) => <Login {...props}/>}/>
                    <Route path='/home' render={(props) => <Home {...props}/>}/>
                </Switch>
            </React.Fragment>
        )
    }
}
export default Routes
