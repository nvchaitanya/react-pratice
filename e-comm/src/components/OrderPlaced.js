import React from 'react'

function OrderPlaced(props){
    const handleClick = () => {
        props.history.push('/')
    }
    return(
        <div className='text-center p-5 text-center'>
            <button className='btn btn-warning mb-3' onClick={handleClick}>Go to HomePage</button>
            <div className='display-2 text-dark'>Thank You for <br /> shopping With us</div>
        </div>
    )
}
export default OrderPlaced