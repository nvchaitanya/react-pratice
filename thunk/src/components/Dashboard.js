import React from 'react'
import { connect } from 'react-redux'

export class Dashboard extends React.Component{
    render(){
        return(
            <div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    data : state.profileData
})
export default connect (mapStateToProps,null)(Dashboard)