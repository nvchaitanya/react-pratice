//actionTYpes
export const ADD_PRODUCT = 'ADD_PRODUCT'
export const FILTER = 'FILTER'
export const LOGIN = 'LOGIN'
export const EDIT_PRODUCT = 'EDIT_PRODUCT'
export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const ADD_TO_CART = 'ADD_TO_CART'
export const INC_QUANTITY = 'INC_QUANTITY'
export const DEC_QUANTITY = 'DEC_QUANTITY'
export const ORDER_PLACED = 'ORDER_PLACED'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'

//actionCreators
export const addProduct = (payload) => ({
    type: ADD_PRODUCT,
    payload
})

export const filter = (payload) => ({
    type:FILTER,
    payload
})

export const login = (payload) => ({
    type:LOGIN,
    payload
})

export const editProduct = (payload) => ({
    type:EDIT_PRODUCT,
    payload
})

export const delProduct = (payload) => ({
    type:DELETE_PRODUCT,
    payload
})

export const addToCart = (payload) => ({
    type:ADD_TO_CART,
    payload
})

export const incQty = (payload) => ({
    type:INC_QUANTITY,
    payload
})

export const decQty = (payload) => ({
    type:DEC_QUANTITY,
    payload
})

export const totalOrdersPlaced = (payload) => ({
    type:ORDER_PLACED,
    payload
})

export const removeFromCart = (payload) => ({
    type:REMOVE_FROM_CART,
    payload
})


