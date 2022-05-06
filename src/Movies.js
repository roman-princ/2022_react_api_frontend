import React, {Component}from "react";
import {variables} from "./variables.js";

export class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
        movies: []      
    };
}

  refreshList() {
      fetch(variables.API_URL + 'movies')
          .then(response => response.json())
          .then(data => this.setState({ movies: data }));
  }

  

  componentDidMount() {
      this.refreshList();
  }
  render() {
      const { movies } = this.state;
  return (
      <table className="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Description</th>       
        </tr>
      </thead>
      <tbody>
        {movies.map(mv =>
          <tr key={mv.movieId}>
            <td>{mv.movieId}</td>
            <td>{mv.title}</td>
            <td>{mv.description}</td>
              
              
              <td>
                  <button type="button" className="btn btn-light btn-outline-danger">Delete</button>
              </td>
          </tr> )}
      </tbody>
    </table>
  );
  }
}