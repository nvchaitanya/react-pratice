import React from 'react'
import { connect } from 'react-redux'

export class Total extends React.Component{
    render(){
        return(
            <div className="my-2 text-dark h6">
                Tasks To be completed
                <div className="p-2">{this.props.count}</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    count: state.InCompletedTasks
})

export default connect(mapStateToProps,null)(Total)