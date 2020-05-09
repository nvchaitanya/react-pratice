//actionType
export const ODD_INPUT = 'ODD_INPUT'
export const EVEN_INPUT = 'EVEN_INPUT'

//actionCreators
export const ActionCreator = (input) =>{
    if(Number(input)%2 !== 0){
        return{
            type:ODD_INPUT
        }
    }
    if(Number(input)%2 === 0){
        return{
            type:EVEN_INPUT
        }
    }
}