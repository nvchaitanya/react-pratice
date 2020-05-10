import {INCREMENT,DECREMENT,ODD,EVEN,MUL,DIV,REMAINDER} from './action'

export const reducer = (state,action) => {
        switch(action.type){
            case INCREMENT:
                return{
                    count : state.count + action.payload
                }
            case DECREMENT:
                return{
                    count : state.count - action.payload
                }
            case ODD:
                return{
                    count : state.count + 1
                }
            case EVEN:
                return{
                    count : state.count + 2
                }
            case MUL:
                return{
                    count : state.count * action.payload
                }
            case DIV:
                return{
                    count : Math.floor(state.count / action.payload)
                }
            case REMAINDER:
                return{
                    count : state.count % action.payload
                }
            default:
                return state
            
        }
}