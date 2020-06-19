import React from 'react'
import uuid from 'react-uuid'
import Table from './Table'

class Transactions extends React.Component{
    
    constructor(props){
        super(props)
            this.state={
                toName:'',
                amount:'',
                paymentType:'',
                total:0,
                transactionData:[],
                filterData:[],
                isdata:false,
                isTransactions:true,
                isCapital:false,
                from:'',
                Balance:50000,
            }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]:e.target.value
        })
    }
    
    handleTransaction = (e) => {
        e.preventDefault()
        let {toName,amount,paymentType} = this.state
        if(toName === '' || amount === '' || paymentType === '') alert('Please fill all the fields!')
        else{
            let dataObj={
                toName:this.state.toName,
                amount:this.state.amount,
                paymentType:this.state.paymentType,
                date:new Date().toLocaleString(),
                id:uuid(),
            }
            this.setState({
                transactionData:[...this.state.transactionData,dataObj],
                filterData:[...this.state.filterData,dataObj],
                isdata:true,
            })
            let balance=this.state.Balance-Number(this.state.amount)
            let localData = [...this.state.transactionData,dataObj]
            localStorage.setItem('txdata',JSON.stringify(localData))
            localStorage.setItem('bal',JSON.stringify(balance))
            this.reset()
        }
    }

    componentDidMount(){
        if(localStorage.getItem('txdata')){
            this.setState({
                transactionData:JSON.parse(localStorage.getItem('txdata')),
                filterData:JSON.parse(localStorage.getItem('txdata')),
                isdata:true
            })
        }

        let user = localStorage.getItem('loggedUser')
        this.setState({
            from:user
        })
    }

    reset = () => {
        this.setState({
            toName:'',
            amount:'',
            paymentType:''
        })
    }

    performFilter = (e) => {
        (e.target.value==='')
                    ?
        this.setState({filterData:this.state.transactionData.filter(element=>element)})
                    :
        this.setState({filterData:this.state.transactionData.filter(element=>element.paymentType===e.target.value)})
    }

    performSort=(e)=>{
        (e.target.value==='asc')
                    ?
        this.setState({filterData:this.state.filterData.sort((a,b)=>Number(a.amount)-Number(b.amount))})
                    :
        this.setState({filterData:this.state.filterData.sort((a,b)=>Number(b.amount)-Number(a.amount))})
    }
    render(){
        return(
            <div className='container border my-3 py-3'> 
                <h6 className="text-right text-muted">Welcome :{this.state.from}</h6>
                <div className="row">
                    <div className="col-10 offset-1 col-md-8 offset-md-2 col-lg-4 offset-lg-0">
                        <h4>New Transaction</h4>
                        <form onSubmit={this.handleTransaction}>
                            <div className="my-3">
                                <label>To</label>
                                <input type="text" 
                                       name="toName" 
                                       value={this.state.toName} 
                                       onChange={this.handleChange} 
                                       className="form-control" 
                                       placeholder="Enter Beneficary Name"/>
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
                                <label>Payment Type</label>
                                <select name="paymentType" 
                                        value={this.state.paymentType} 
                                        onChange={this.handleChange} 
                                        className="form-control">
                                    <option value="--">-- Select Payment Type --</option>
                                    <option value="online">ONLINE</option>
                                    <option value="card">CARD</option>
                                </select>
                            </div>
                            <div className="text-center">
                                <button className="btn btn-info px-5">Pay</button>
                            </div>
                        </form>
                    </div>
                    {this.state.isdata && <Table tabdata={this.state.filterData}
                                           handleFilter={this.performFilter}
                                           handleSort={this.performSort}
                                           balance = {this.state.Balance}/>}
                </div>
            </div>
        )
    }
}
export default Transactions