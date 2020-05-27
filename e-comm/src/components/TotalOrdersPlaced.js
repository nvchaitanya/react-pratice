import React from 'react'
import { connect } from 'react-redux'

export class TotalOrdersPlaced extends React.Component{
    handleClick = () => {
        this.props.history.push('/')
    }
    render(){
        return(
            <div className='container p-5'>
                <button className='btn btn-outline-dark m-2' onClick={this.handleClick}>Go to HomePage</button>
                <h3 className='m-2'>Orders History</h3>
                <div className='table-responsive'>
                    <table className='table'>
                        <thead>
                            <tr>
                                <td>Name of Product</td>
                                <td>Quantity</td>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.data.map(element =>
                                <tr key={element.id}>
                                    <td>{element.title}</td>
                                    <td>{element.count}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state) => ({
    data : state.ordersPlaced
})
export default connect(mapStateToProps,null)(TotalOrdersPlaced)