import {ADD_NEW_TODO,DELETE_TODO,TOGGLE,COUNT} from './Action'

const initState={
    todo:[],
    InCompletedTasks:0
}

export const reducer = (state = initState,{type,payload}) => {
    switch(type){

        case ADD_NEW_TODO:
            return{
                ...state,
                todo: [...state.todo,payload]
            }
        
        case COUNT:
            return{
                ...state,
                InCompletedTasks: state.todo.filter(element => element.completed === false).length
            }
        case TOGGLE:
            return{
                ...state,
                todo: state.todo.map(element => element.id===payload?{...element,completed:!element.completed}: element)
            }
        case DELETE_TODO:
            return{
                ...state,
                todo:state.todo.filter(element => element.id !== payload)
            }
        default:
            return state
    }
}