//action Types
export const INCREMENT = 'INCERMENT'
export const DECREMENT = 'DECREMENT'
export const ODD = 'ODD'
export const EVEN = 'EVEN'
export const MUL = 'MUL'
export const DIV = 'DIV'
export const REMAINDER = 'REMAINDER'

//actionCreators
export const increment = (payload) => ({
    type:INCREMENT,
    payload
})

export const decrement = (payload) => ({
    type:DECREMENT,
    payload
})

export const ActionCreator = (payload) => {
    if(Number(payload)%2 !== 0){
        return{
            type:ODD,
            // payload
        }
    }
    if(Number(payload)%2 ===0){
        return{
            type:EVEN,
            // payload
        }
    }
}

export const mul = (payload) => ({
    type:MUL,
    payload
})

export const div = (payload) => {
    if(payload === 0){
        alert('Invalid Operation')
        return{
            type: DIV,
            payload : 1
        }
    }else{
        return{
            type: DIV,
            payload
        }
    }
    
}

export const modulo = (payload) => ({
    type:REMAINDER,
    payload
})