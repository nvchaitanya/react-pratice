//ActionTypes
export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'

//actionCreators
export const add_counter = (payload)=>({
      type:INCREMENT,
      payload
})

export const dec_counter = (payload) => ({
      type:DECREMENT,
      payload
})