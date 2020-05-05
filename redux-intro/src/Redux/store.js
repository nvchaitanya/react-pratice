import {createStore} from 'redux'
import reducer,{initState} from './reducers'

export const store = createStore(reducer,initState)