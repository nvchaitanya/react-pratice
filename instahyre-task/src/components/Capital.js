import React from 'react'

class Capital extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            document:'',
            amount:'',
            file:'',
            isdata:false
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }

    submitCapital = (e) => {
        e.preventDefault()
    }

    render(){
        console.log(this.state)
        return(
            <div className='container border my-3 py-3'> 
                <div className="row">
                    <div className="col-10 offset-1 col-md-8 offset-md-2 col-lg-4 offset-lg-0">
                        <h4>New Transaction</h4>
                        <form onSubmit={this.submitCapital}>
                            <div className="my-3">
                                <label>Document</label>
                                <input type="text" 
                                       name="document" 
                                       value={this.state.document} 
                                       onChange={this.handleChange} 
                                       className="form-control" 
                                       placeholder="Enter Document Name"/>
                            </div>
                            <div className="my-3">
                                <label>Amount</label>
                                <input type="number" 
                                       name="amount" 
                                       value={this.state.amount} 
                                       onChange={this.handleChange} 
                                       className="form-control" 
                                       placeholder="Enter Amount"/>
                            </div>
                            <div className="my-3">
                                <label>Attach File</label>
                                <input type="file" 
                                       name="file" 
                                       value={this.state.file} 
                                       onChange={this.handleChange} 
                                       className="form-control" 
                                       placeholder="Enter Amount"/>

                            </div>
                            <div className="text-center">
                                <button className="btn btn-info px-5">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Capital