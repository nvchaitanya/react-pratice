import React from 'react'
import {Route,Link,Switch} from 'react-router-dom'
import Home from './Home'

const Routes = ()=> {
    return(
        <div>
            <div>
                <Link to='/'>Home</Link>
            </div>
            <div>
                <Link to='/other'>Other Routes</Link>
            </div>
            <Switch>
                <Route path='/' exact render={() => <Home />}/>
            </Switch>
        </div>
    )
}
export default Routes