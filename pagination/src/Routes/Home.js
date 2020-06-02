import React from 'react'
import { connect } from 'react-redux'
import {fetchData} from '../Redux/Action'
import Pagination from '../components/Pagination'
import Data from '../components/Data'

export const Home = ({isLoading,fetchData}) => {
    return(
        <div>
            {isLoading && 'Loading ...'}
            <Data />
            <Pagination />
            <button onClick={fetchData}>Get Data</button>
        </div>
    )
}
const mapDispatchToProps = dispatch =>({
    fetchData : () => dispatch(fetchData())
})

export default connect(null,mapDispatchToProps)(Home)