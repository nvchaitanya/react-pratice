import React from 'react'
import Model from './Model'

class RepoTable extends React.Component{
    render(){
        return(
            <div className="col-md-12 text-center table-responsive">
                <table className="table table-secondary">
                    <thead className="thead-dark">
                        <tr>
                            <th>Owner Pic</th>
                            <th>Repo Name</th>
                            <th>Repo Id</th>
                            <th>Created At</th>
                            <th>Forks Count</th>
                            <th>HTML url</th>
                            <th>Owner Profile</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.repo.map(element=>
                            <tr key={element.id}>
                                <td><img src={element.owner.avatar_url} alt="pic" height={90}/></td>
                                <td className="pt-5">{element.name}</td>
                                <td className="pt-5">{element.id}</td>
                                <td className="pt-5">{element.created_at}</td>
                                <td className="pt-5">{element.forks_count}</td>
                                <td className="pt-5"><a href={element.owner.html_url} target="blank">External Link</a></td>
                                <th className="pt-5"><Model nameLabel="Repo Name" name={element.name} pic={element.owner.avatar_url}
                                                            id={element.id} label="Created at" score={element.created_at}/></th>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
}
export default RepoTable