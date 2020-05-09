import {createStore} from 'redux'
import {reducer} from './reducer'

const initState  ={
    count : 5
}
const store = createStore(reducer,initState)
export default store