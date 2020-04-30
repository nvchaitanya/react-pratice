import React from 'react'
import Model from './Model'

class Table extends React.Component{
    render(){
        return(
            <div>
                <div className="col-md-12 text-center table-responsive my-5">
                    <table className="table table-secondary">
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
                                    <td><img src={element.avatar_url} alt="pic" height={90}/></td>
                                    <td className="pt-5">{element.login}</td>
                                    <td className="pt-5">{element.id}</td>
                                    <td className="pt-5"><a href={element.html_url} target="blank">External Github</a></td>
                                    <td className="pt-5"><a href={element.repos_url} target="blank" className="text-decoration-none">Repos</a></td>
                                    <td className="pt-5"><Model name={element.login} pic={element.avatar_url} id={element.id} score={element.score}/></td>
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