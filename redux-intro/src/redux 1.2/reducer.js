import {ODD_INPUT,EVEN_INPUT} from './action'

export const reducer = (state,action) => {
    switch(action.type){
        case ODD_INPUT:
            return {
                count : state.count + 1
            }
        case EVEN_INPUT:
            return{
              count : state.count + 2  
            } 
        default:
            return state
    }
}