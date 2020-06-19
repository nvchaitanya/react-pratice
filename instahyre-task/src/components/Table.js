import React from 'react'

const PlotTable = (props) => {
    return(
        <tr>
            <th>{props.date}</th>
            <th>{props.name}</th>
            <th>{props.pay}</th>
            <th>{props.amount}</th>
        </tr>
    )
}

class Table extends React.Component{
    
    render(){
        let remainingAmount = localStorage.getItem('bal')
        return(
            <div className='col-12 col-md-12 col-lg-8'>
                <select onClick={this.props.handleFilter} 
                        className="px-4 py-1 bg-warning my-2 mx-3">
                    <option value="--">-- Select Payment Type --</option>
                    <option value="online">ONLINE</option>
                    <option value="card">CARD</option>
                </select>
                <select onClick={this.props.handleSort} 
                        className="px-4 py-1 bg-warning my-2 mx-3">
                    <option value="--">-- Sort by Amount --</option>
                    <option value="asc">Ascending</option>
                    <option value="des">Descending</option>
                </select>
                <div className='col-md-12 table-responsive'>
                    <table className='table border'>
                        <thead className='thead-dark'>
                            <tr>
                                <th>Date</th>
                                <th>Beneficiary Name</th>
                                <th>Payment Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.tabdata.map(element => <PlotTable key={element.id}
                                                                    id={element.id}
                                                                    date={element.date}
                                                                    name={element.toName}
                                                                    pay={element.paymentType}
                                                                    amount={element.amount}
                                                                    />)}
                        </tbody>
                    </table>
                </div>
                <h6 className='text-right mr-5 pr-3 font-weight-bold'>Balance : {remainingAmount}</h6>
            </div>
        )
    }
}
export default Table