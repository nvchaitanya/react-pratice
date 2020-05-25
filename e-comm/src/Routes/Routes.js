import React from 'react'
import { Route,Switch } from 'react-router-dom'
import Home from '../components/Home'
import Login from '../components/Login'
import AddProduct from '../components/AddProduct'
import Update from '../components/Update'

class Routes extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Switch>
                    <Route path='/' exact render={() => <Home />}/>
                    <Route path='/login' render={() => <Login />}/>  
                    <Route path='/addproduct' exact render={() => <AddProduct />}/>  
                    <Route path='/addproduct/:id' render={() => <Update />}/>
                </Switch>
            </React.Fragment>
        )
    }
}
export default Routes