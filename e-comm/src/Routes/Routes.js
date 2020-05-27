import React from 'react'
import { Route,Switch } from 'react-router-dom'
import Home from '../components/Home'
import Login from '../components/Login'
import AddProduct from '../components/AddProduct'
import Update from '../components/Update'
import Cart from '../components/Cart'
import Orders from '../components/Orders'
import CardPayment from '../components/CardPayment'
import UPIPayment from '../components/UPIPayment'
import OrderPlaced from '../components/OrderPlaced'
import TotalOrdersPlaced from '../components/TotalOrdersPlaced'

class Routes extends React.Component{
    render(){
        return(
            <React.Fragment>
                <Switch>
                    <Route path='/' exact render={(props) => <Home {...props}/>}/>
                    <Route path='/login' render={(props) => <Login {...props}/>}/>  
                    <Route path='/addproduct' exact render={(props) => <AddProduct {...props}/>}/>  
                    <Route path='/addproduct/:id' render={(props) => <Update {...props}/>}/>
                    <Route path='/cart' render={(props) => <Cart {...props}/>}/>
                    <Route path='/order' render={(props) => <Orders {...props}/>}/>
                    <Route path='/cardPayment' render={(props) => <CardPayment {...props}/>}/>
                    <Route path='/upiPayment' render={(props)=> <UPIPayment {...props}/>}/>
                    <Route path='/orderPlaced' render={(props) => <OrderPlaced {...props}/>} />
                    <Route path='/totalOrdersPlaced' render={(props) => <TotalOrdersPlaced {...props}/>}/>
                </Switch>
            </React.Fragment>
        )
    }
}
export default Routes