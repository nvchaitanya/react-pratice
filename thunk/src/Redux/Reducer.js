import {FETCH_REQUEST,REGISTER_SUCCESS,LOGIN_SUCCESS} from './Action'

const initState={
    iserror:true,
    isregistered:false,
    profileData:[]
}

export const reducer = (state = initState,{type,payload}) => {
    switch(type){

        case FETCH_REQUEST:
            return{
                ...state,
                userData:payload
            }

        case REGISTER_SUCCESS:
            return{
                ...state,
                iserror:false,
                isregistered:true,
            }

        case LOGIN_SUCCESS:
            return{
                ...state,
                iserror:false,
                profileData:[...state.profileData,payload]
            }

        default:
            return state
    }
}