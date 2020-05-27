import {ADD_PRODUCT,FILTER,LOGIN,EDIT_PRODUCT,DELETE_PRODUCT,ADD_TO_CART,INC_QUANTITY,DEC_QUANTITY,ORDER_PLACED,REMOVE_FROM_CART} from './Action'

const initState={
    data:[
        {
            category:"mobiles",
            id:1,
            title:'Nokia 8.3 5G',
            price:9999,
            rating:4.5,
            count:1,
            src:'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        },
        {
            category:"mobiles",
            id:2,
            title:'Apple iPhone XR 64GB',
            price:35999,
            rating:4.6,
            count:1,
            src:'https://images.unsplash.com/photo-1550367083-9fa5411cb303?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
        },
        {
            category:"mobiles",
            id:3,
            title:'Samsung Galaxy M20 32GB',
            price:16999,
            rating:4.2,
            count:1,
            src:'https://images.unsplash.com/photo-1476039863276-5b0ebbbc488f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
        },
        {
            category:"mobiles",
            id:4,
            title:'Redmi Note5 Pro 64GB',
            price:12999,
            rating:4.8,
            count:1,
            src:'https://images.unsplash.com/photo-1510166089176-b57564a542b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
        },
        {
            category:"mobiles",
            id:5,
            title:'Redmi Note7 Pro 64GB',
            price:14999,
            rating:4.7,
            count:1,
            src:'https://images.unsplash.com/photo-1524856076870-0d765c831d68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
        },
        {
            category:"mobiles",
            id:6,
            title:'Oppo RENO 2Z 256GB',
            price:19999,
            rating:4.1,
            count:1,
            src:'https://images.pexels.com/photos/1202575/pexels-photo-1202575.jpeg?https://images.unsplash.com/photo-1510297182321-a75bdc5b1299?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60=compress&cs=tinysrgb&dpr=1&w=500'
        },
        {
            category:"watches",
            count:1,
            id:7,
            title:"NG38003PP05C Tees Sports Watch",
            price:599,
            rating:4.7,
            src:"https://images.pexels.com/photos/158741/gshock-watch-sports-watch-stopwatch-158741.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:8,
            title:"NG38003PP05C Tees Analog Watch ",
            price:699,
            rating:4.2,
            src:"https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:9,
            title:"NG38003PP05C Sports Watch",
            price:899,
            rating:4.2,
            src:"https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:10,
            title:"NG38003PP05C Tees Analog Watch",
            price:699,
            rating:4.2,
            src:"https://images.pexels.com/photos/236915/pexels-photo-236915.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:11,
            title:"NG38003PP05C Tees Analog Watch - For Men & Women",
            price:1699,
            rating:4.2,
            src:"https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        }
    ],

    tempData:[
        {
            category:"mobiles",
            id:1,
            title:'Nokia 8.3 5G',
            price:9999,
            rating:4.5,
            count:1,
            src:'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        },
        {
            category:"mobiles",
            id:2,
            title:'Apple iPhone XR 64GB',
            price:35999,
            rating:4.6,
            count:1,
            src:'https://images.unsplash.com/photo-1550367083-9fa5411cb303?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
        },
        {
            category:"mobiles",
            id:3,
            title:'Samsung Galaxy M20 32GB',
            price:16999,
            rating:4.2,
            count:1,
            src:'https://images.unsplash.com/photo-1476039863276-5b0ebbbc488f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
        },
        {
            category:"mobiles",
            id:4,
            title:'Redmi Note5 Pro 64GB',
            price:12999,
            rating:4.8,
            count:1,
            src:'https://images.unsplash.com/photo-1510166089176-b57564a542b1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
        },
        {
            category:"mobiles",
            id:5,
            title:'Redmi Note7 Pro 64GB',
            price:14999,
            rating:4.7,
            count:1,
            src:'https://images.unsplash.com/photo-1524856076870-0d765c831d68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
        },
        {
            category:"mobiles",
            id:6,
            title:'Oppo RENO 2Z 256GB',
            price:19999,
            rating:4.1,
            count:1,
            src:'https://images.pexels.com/photos/1202575/pexels-photo-1202575.jpeg?https://images.unsplash.com/photo-1510297182321-a75bdc5b1299?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60=compress&cs=tinysrgb&dpr=1&w=500'
        },
        {
            category:"watches",
            count:1,
            id:7,
            title:"NG38003PP05C Tees Sports Watch",
            price:599,
            rating:4.7,
            src:"https://images.pexels.com/photos/158741/gshock-watch-sports-watch-stopwatch-158741.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:8,
            title:"NG38003PP05C Tees Analog Watch ",
            price:699,
            rating:4.2,
            src:"https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:9,
            title:"NG38003PP05C Sports Watch",
            price:899,
            rating:4.2,
            src:"https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:10,
            title:"NG38003PP05C Tees Analog Watch",
            price:699,
            rating:4.2,
            src:"https://images.pexels.com/photos/236915/pexels-photo-236915.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:11,
            title:"NG38003PP05C Tees Analog Watch - For Men & Women",
            price:1699,
            rating:4.2,
            src:"https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        }
    ],
    userType:'',
    login:false,
    cart:false,
    cartData:[],
    ordersPlaced:[],
    total:0
}

export const reducer = (state=initState, { type,payload }) => {
    
    switch(type) { 

        case ADD_PRODUCT:
            return {
                ...state,
                data:[...state.data,payload],
                tempData:[...state.data]
            }

        case DELETE_PRODUCT:
            return{
                ...state,
                data:state.data.filter(element => element.id !== payload),
                tempData : state.data
            }

        case EDIT_PRODUCT:
            return{
                ...state,
                data:state.data.map(element=> element.id===payload.id ? payload : element),
                tempData:state.data
            }
        
        case LOGIN:
            return{
                ...state,
                login:true,
                userType:payload
            }

        case FILTER:
            if(payload === ""){
                return{
                    ...state,
                    tempData:[...state.data]
                }
            }
            else{
                return{
                    ...state,
                    tempData : state.data.filter(element => element.category === payload)
                }
            }

        case ADD_TO_CART:
            let productToBeAdded = state.data.filter(element => element.id === payload)
            let alreadyInCart = state.cartData.filter(element => element.id === payload)
            if(alreadyInCart.length){
                alert('Product already in cart!')
                return{
                    ...state,
                    tempData:[...state.data]
                }
            }
            else{
                return{
                    ...state,
                    cart:true,
                    cartData:[...state.cartData,productToBeAdded[0]]
                }
            }

        case INC_QUANTITY:
            return{
                ...state,
                cartData: state.cartData.map(element => {
                    if(element.id === payload){
                        element.count = element.count+1
                    }
                    return element
                })
            }

        case DEC_QUANTITY:
            return{
                ...state,
                cartData : state.cartData.map(element => {
                    if(element.id === payload){
                        element.count = element.count - 1
                        if(element.count === 0){
                            state.cart  = false
                        }
                    }
                    return element
                })
            }

        case REMOVE_FROM_CART:
            return{
                ...state,
                cartData:state.cartData.map(element => {
                    if(element.id === payload){
                        element.count = 1
                    }
                    return element
                }),
                cartData:state.cartData.filter(element => element.id !== payload)
            }

        case ORDER_PLACED:
            return{
                ...state,
                ordersPlaced:[...state.ordersPlaced,...payload],
                cartData:[]
            }

        default:
            return state
    }
}