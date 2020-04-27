import React from 'react'
class Table extends React.Component{
    render(){
        return(
            <div>
                <div className="col-11 offset-1 col-md-12 offset-md-0 col-lg-12 table-responsive">
                    <table className="table">
                        <thead className="thead-dark">
                            <tr>
                                <th>Profile Pic</th>
                                <th>Login Name</th>
                                <th>Id</th>
                                <th>HTML url</th>
                                <th>Repo's Link</th>
                                <th>Profile Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.tabdata.map(element=>
                                <tr key={element.id}>
                                    <td><img src={element.avatar_url} alt="pic" height='100px'/></td>
                                    <td className="pt-5">{element.login}</td>
                                    <td className="pt-5">{element.id}</td>
                                    <td className="pt-5"><a href={element.html_url} target="_blank">External Github</a></td>
                                    <td className="pt-5"><a href={element.repos_url} target="_blank">Repos</a></td>
                                    <td className="pt-5"><button className="btn btn-primary">Profile Information</button></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
export default Table