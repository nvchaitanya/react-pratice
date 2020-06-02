import React from 'react'
import {connect} from 'react-redux'
import {changePage} from '../Redux/Action'

const Pagination = ({page,totalPages,changePage}) => {
    const pageList = []
    for(let i=page-1;i>=0 && i<=page+3 && i<=totalPages;i++){
        if(i===page-1){
            if(i!==0)
                pageList.push(<button key={i} onClick={() => changePage(page-1)}>Previous</button>)
            continue;
        }
        if(i===page+3){
            pageList.push(<button key={i} onClick={() => changePage(page+1)}>Next</button>)
            continue;
        }
        pageList.push(<button key={i} style={{color:`${page===i?'red':'black'}`}}onClick={() => changePage(i)}> {i}</button>)
    }

    return(
        <div>
            {totalPages!==0 && pageList}
        </div>
    )
}

const mapStateToProps = state => ({
    page : state.page,
    totalPages:state.totalPages
})

const mapDispatchToProps = dispatch => ({
    changePage :(payload) => dispatch(changePage(payload)) 
})

export default connect(mapStateToProps,mapDispatchToProps)(Pagination)