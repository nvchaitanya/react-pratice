import React from 'react'
import {connect} from 'react-redux'

const Data = ({data,page,perPage}) => {
    return(
        <div>
            {data && data.filter((a,i) => i>=perPage*(page-1) && i<perPage*page).map(item => 
                <div key={item.id}>
                    <div>S.NO :{item.id}</div>
                    <div>User Id :{item.userId}</div>
                    <div>Title :{item.title}</div>
                    <div>Status :{item.completed.toString()}</div>
                </div>
            )}
        </div>
    )
}

const mapStateToProps = state => ({
    data: state.data,
    page : state.page,
    perPage : state.perPage
})

export default connect(mapStateToProps,null)(Data)