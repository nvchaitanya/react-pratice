import axios from 'axios'
//actionTypes
export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST'
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE'
export const CHANGE_PAGE_NO = 'CHANGE_PAGE_NO'

//actionCreators
export const fetchDataRequest = (payload) => ({
    type:FETCH_DATA_REQUEST,
    payload
})

export const fetchDataSuccess = (payload) => ({
    type:FETCH_DATA_SUCCESS,
    payload
})

export const fetchDataFailure = (payload) => ({
    type:FETCH_DATA_FAILURE,
    payload
})

export const fetchData = () => {
    return dispatch => {
        dispatch(fetchDataRequest())
        axios.get('https://jsonplaceholder.typicode.com/todos')
        .then(res => dispatch(fetchDataSuccess(res.data)))
        .catch(error => dispatch(fetchDataFailure(error)))
    }
}

export const changePage = (payload) => ({
    type:CHANGE_PAGE_NO,
    payload
})