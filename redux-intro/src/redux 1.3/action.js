//actionTypes
export const MUL = 'MUL'
export const DIV = 'DIV'
export const REMAINDER = 'REMAINDER'

//actionCreators
export const mul = (payload) => ({
    type:MUL,
    payload
})

export const div = (payload) => {
   if(payload===0){
       alert('Not Possible')
       return{
           type:DIV,
           payload:1
       }
   } 
   else{
       return{
            type:DIV,
            payload
       }
   }
}

export const remainder = (payload) => {
    if(payload===0){
        alert('Not Possible')
        return{
            type:REMAINDER,
            payload:1
        }
    } 
    else{
        return{
             type:REMAINDER,
             payload
        }
    }
}