import {createStore} from 'redux'
import {reducer} from './reducer'
 
const initState={
    count : 0
}

const store  = createStore(reducer,initState)
export default store