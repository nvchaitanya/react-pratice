import React, { useState } from 'react'
export default function App(){
    const [counter,setCounter] = useState(0)
    return(
        <div>
            <h1>count: {counter}</h1>
            <button onClick={() => setCounter(counter+1)}>Increment</button>
            <button onClick={() => setCounter(counter-1)}>Decrement</button>
        </div>
    )
}