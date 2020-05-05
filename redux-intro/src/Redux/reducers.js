import {ADD_COUNTER , REDUCE_COUNTER} from './actionTypes'

export const initState = 0

export default (state,{type,payload}) =>{
    switch(type){
        case ADD_COUNTER:
            return state + payload
        case REDUCE_COUNTER:
            return state - payload
        default:
            return state
    }
}