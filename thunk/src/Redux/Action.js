import axios from 'axios'
//actionTypes
export const FETCH_REQUEST = 'FETCH_REQUEST'
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS'
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'


//actionCreators
export const fetchPost = (payload) => ({
    type:FETCH_REQUEST,
    payload
})

export const register_success = (payload) => ({
    type:REGISTER_SUCCESS,
    payload
})

export const login_success = (payload) => ({
    type:LOGIN_SUCCESS,
    payload
})

export const fetchRegister = (query) => {
    return dispatch => {
        dispatch(fetchPost())
        return axios
        .post('http://localhost:8080/auth/register',query)
        .then(res =>{
            if(res.data.error==='false'){
                alert('Registration Successfull')
                return dispatch(register_success(res.data))
            }
            else if(res.data.error==='true'){
                alert('Registration fail, User already exists!')
            }
        })
        .catch(error => console.log(error))
    }
}

export const fetchLogin = (data) => {
    return dispatch => {
        dispatch(fetchPost())
        return axios
        .post('http://localhost:8080/auth/login',data)
        .then(res =>{
            if(res.data.error==='false'){
                alert('Login Successfull')
                return dispatch(fetchData(res.data.token,data.username))
            }
            else if(res.data.error === 'true'){
                alert('Invalid Login Credentials')
            }
        })
        .catch(error => console.log(error))
    }
}

export const fetchData = (token,name) => {
    return dispatch => {
        dispatch(fetchPost())
        return axios
        .post(`http://localhost:8080/user/${name}`,{headers:{Authorization: `Bearer ${token}`}})
        .then(res => {
            return dispatch(login_success(res.data))
        })
        .catch(error => console.log(error))
    }
}