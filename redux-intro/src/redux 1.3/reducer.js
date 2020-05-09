import {MUL,DIV,REMAINDER} from './action'

export const reducer = (state,action) =>{
    switch(action.type){
        case MUL:
            return{
                count : state.count * action.payload
            }
        case DIV : 
            return{
                count : state.count / action.payload
            }
        case REMAINDER:
            return{
                count : state.count % action.payload
            }
        default:
            return state
    }
}