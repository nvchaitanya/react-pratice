import {ADD_PRODUCT,FILTER,LOGIN,EDIT_PRODUCT,DELETE_PRODUCT,ADD_TO_CART,INC_QUANTITY,DEC_QUANTITY,ORDER_PLACED,REMOVE_FROM_CART} from './Action'

const initState={
    data:[
        {
            id:1,
            title:'Nokia 8.3 5G',
            price:9999,
            rating:4.5,
            count:1,
            src:'https://images.ctfassets.net/d6skzop43my5/6OyxwWln6Ke5UuX8hHLzZZ/5ae77b5f60dada8a8be63a0102ac7e45/nokia_5_3-front-cyan.png?q=50'
        },
        {
            id:2,
            title:'Apple iPhone XR 64GB',
            price:35999,
            rating:4.6,
            count:1,
            src:'https://technextmobiles.com/wp-content/uploads/2019/03/iphone-xr-bl2.jpg'
        },
        {
            id:3,
            title:'Samsung Galaxy M20 32GB',
            price:16999,
            rating:4.2,
            count:1,
            src:'https://www.ispyprice.com/static/nwprd_model/samsung-galaxy-m20-8894.jpg'
        },
        {
            id:4,
            title:'Redmi Note5 Pro 64GB',
            price:12999,
            rating:4.8,
            count:1,
            src:'https://global.appmifile.com/webfile/globalimg/in/cms/78986F32-B186-1319-AA4A-0F54E7E6CA59.jpg'
        },
        {
            id:5,
            title:'Redmi Note7 Pro 64GB',
            price:14999,
            rating:4.7,
            count:1,
            src:'https://images-na.ssl-images-amazon.com/images/I/61mggbFAMuL._SY679_.jpg'
        },
        {
            id:6,
            title:'Oppo RENO 2Z 256GB',
            price:19999,
            rating:4.1,
            count:1,
            src:'https://www.sathya.in/Media/Default/Thumbs/0033/0033906-oppo-mobile-reno-2z-white-8gb-ram-256gb-storage.jpg'
        },
        {
            category:"watches",
            count:1,
            id:6,
            title:"NG38003PP05C Tees Sports Watch",
            price:599,
            rating:4.7,
            src:"https://images.pexels.com/photos/158741/gshock-watch-sports-watch-stopwatch-158741.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:7,
            title:"NG38003PP05C Tees Analog Watch ",
            price:699,
            rating:4.2,
            src:"https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:8,
            title:"NG38003PP05C Sports Watch",
            price:899,
            rating:4.2,
            src:"https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:9,
            title:"NG38003PP05C Tees Analog Watch",
            price:699,
            rating:4.2,
            src:"https://images.pexels.com/photos/236915/pexels-photo-236915.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:10,
            title:"NG38003PP05C Tees Analog Watch - For Men & Women",
            price:1699,
            rating:4.2,
            src:"https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        }
    ],

    tempData:[
        {
            id:1,
            title:'Nokia 8.3 5G',
            price:9999,
            rating:4.5,
            count:1,
            src:'https://images.ctfassets.net/d6skzop43my5/6OyxwWln6Ke5UuX8hHLzZZ/5ae77b5f60dada8a8be63a0102ac7e45/nokia_5_3-front-cyan.png?q=50'
        },
        {
            id:2,
            title:'Apple iPhone XR 64GB',
            price:35999,
            rating:4.6,
            count:1,
            src:'https://technextmobiles.com/wp-content/uploads/2019/03/iphone-xr-bl2.jpg'
        },
        {
            id:3,
            title:'Samsung Galaxy M20 32GB',
            price:16999,
            rating:4.2,
            count:1,
            src:'https://www.ispyprice.com/static/nwprd_model/samsung-galaxy-m20-8894.jpg'
        },
        {
            id:4,
            title:'Redmi Note5 Pro 64GB',
            price:12999,
            rating:4.8,
            count:1,
            src:'https://global.appmifile.com/webfile/globalimg/in/cms/78986F32-B186-1319-AA4A-0F54E7E6CA59.jpg'
        },
        {
            id:5,
            title:'Redmi Note7 Pro 64GB',
            price:14999,
            rating:4.7,
            count:1,
            src:'https://images-na.ssl-images-amazon.com/images/I/61mggbFAMuL._SY679_.jpg'
        },
        {
            id:6,
            title:'Oppo RENO 2Z 256GB',
            price:19999,
            rating:4.1,
            count:1,
            src:'https://www.sathya.in/Media/Default/Thumbs/0033/0033906-oppo-mobile-reno-2z-white-8gb-ram-256gb-storage.jpg'
        },
        {
            category:"watches",
            count:1,
            id:6,
            title:"NG38003PP05C Tees Sports Watch",
            price:599,
            rating:4.7,
            src:"https://images.pexels.com/photos/158741/gshock-watch-sports-watch-stopwatch-158741.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:7,
            title:"NG38003PP05C Tees Analog Watch ",
            price:699,
            rating:4.2,
            src:"https://images.pexels.com/photos/277319/pexels-photo-277319.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:8,
            title:"NG38003PP05C Sports Watch",
            price:899,
            rating:4.2,
            src:"https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:9,
            title:"NG38003PP05C Tees Analog Watch",
            price:699,
            rating:4.2,
            src:"https://images.pexels.com/photos/236915/pexels-photo-236915.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
        },
        {
            category:"watches",
            count:1,
            id:10,
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

        case LOGIN:
            return{
                ...state,
                login:true,
                userType:payload
            }

    }
}