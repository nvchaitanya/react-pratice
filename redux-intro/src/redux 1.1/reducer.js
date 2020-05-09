import {INCREMENT , DECREMENT} from './action'

const reducer = (state,action) => {
    switch(action.type){
        case INCREMENT:
            return{
                count : state.count + action.payload
            }
        case DECREMENT:
            return{
                count : state.count - action.payload
            }
        default:
            return state
    }
}
export default reducer