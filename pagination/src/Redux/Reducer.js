import {FETCH_DATA_REQUEST,FETCH_DATA_SUCCESS,FETCH_DATA_FAILURE,CHANGE_PAGE_NO} from './Action'

const initState = {
    page:1,
    data:[],
    perPage:10,
    totalPages:0,
    length:0,
    isLoading:false,
    isError:false
}

export const reducer = (state = initState,{type,payload}) => {
    switch(type){

        case FETCH_DATA_REQUEST:
            return{
                ...state,
                isLoading:true,
                isError:false
            }

        case FETCH_DATA_SUCCESS:
            return{
                ...state,
                data:payload,
                isLoading:false,
                length:payload.length,
                totalPages:payload.length/state.perPage
            }

        case FETCH_DATA_FAILURE:
            return{
                ...state,
                error:true
            }

        case CHANGE_PAGE_NO:
            return{
                ...state,
                page:payload
            }

        default:
            return state
    }
}