import React from 'react'
import { Route,Switch } from 'react-router-dom'
import Login from '../components/Login'

class Routes extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Switch>
                    <Route path='/login' render={() => <Login />}/>  
                </Switch>
            </React.Fragment>
        )
    }
}
export default Routes