import React, { Component } from "react";
import { variables } from "./variables.js";

export class Movies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      actors: [],
      movieId: 0,
      title: '',
      description: '',
      movieId: 0,

      movieIdFilter: '',
      titleFilter: '',
      descriptionFilter: '',
      moviesWithoutFilter: []
    };
  }

  refreshList() {
    fetch(variables.API_URL + 'movies')
      .then(response => response.json())
      .then(data => this.setState({ movies: data, moviesWithoutFilter: data }));
  }

  FilterFn() {
    var MoviesIdFilter = this.state.movieIdFilter;
    var TitleFilter = this.state.titleFilter;
    var DescriptionFilter = this.state.descriptionFilter;
    var filteredData = this.state.moviesWithoutFilter.filter(
      function (el) {
        return el.movieId.toString().toLowerCase().startsWith(MoviesIdFilter.toString().trim().toLowerCase())
          && el.title.toString().toLowerCase().startsWith(TitleFilter.toString().trim().toLowerCase())
          && el.description.toString().toLowerCase().startsWith(DescriptionFilter.toString().trim().toLowerCase());
      });
    this.setState({ movies: filteredData });

  }
  changeMovieIdFilter = (e) => {
    this.state.movieIdFilter = e.target.value;
    this.FilterFn();
  }
  changeTitleFilter = (e) => {
    this.state.titleFilter = e.target.value;
    this.FilterFn();
  }
  changeDescriptionFilter = (e) => {
    this.state.descriptionFilter = e.target.value;
    this.FilterFn();
  }


  deleteMovie(movieId) {
    fetch(variables.API_URL + 'movies/' + movieId, {
      method: 'DELETE'
    }).then(() => {
      this.refreshList();
    }
    );
  }

  generateGUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
  changetitle = (e) => {
    this.setState({ title: e.target.value });
  }
  changedescription = (e) => {
    this.setState({ description: e.target.value });
  }

  createClick() {
    fetch(variables.API_URL + 'movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.generateGUID(),
        title: this.state.title,
        description: this.state.description
      })
    }).then(() => {
      this.refreshList();
    }
    );
  }
  updateClick() {
    fetch(variables.API_URL + 'movies/' + this.state.movieId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        movieId: this.state.movieId,
        title: this.state.title,
        description: this.state.description
      })
    }).then(() => {
      this.refreshList();
    }
    );
  }

  addClick = (e) => {
    this.setState({
      movieId: 0,
      title: '',
      description: ''
    });

  }

  editClick(movieId) {
    fetch(variables.API_URL + 'movies/' + movieId)
      .then(response => response.json())
      .then(data => {
        this.setState({
          movieId: data.movieId,
          title: data.title,
          description: data.description
        });
      }
      );
  }

  actorsinmovie(id) {
    fetch(variables.API_URL + 'movies/' + id + '/actors')
      .then(response => response.json())
      .then(data => {
        this.setState({ actors: data });
      }
      );
    console.log(this.state.actors);
    this.setState({ actors: [] });
    this.setState({ movieId: id });
  }
  deletefrommovie(actorId) {
    fetch(variables.API_URL + 'actors/' + actorId + '/movie/' + this.state.movieId, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result => {
        this.refreshList();
        this.actorsinmovie(this.state.movieId);
      }, error => {
        console.log(error);
      })


  }


  componentDidMount() {
    this.refreshList();
  }
  render() {
    const { movies, movieId, title, description, actors } = this.state;
    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">
                <input className="form-control m-2"
                  onChange={this.changeMovieIdFilter}
                  placeholder="Id" />
                #
              </th>
              <th scope="col">
                <input className="form-control m-2"
                  onChange={this.changeTitleFilter}
                  placeholder="Title" />
                Title
              </th>
              <th scope="col">
                <input className="form-control m-2"
                  onChange={this.changeDescriptionFilter}
                  placeholder="Description" />
                Description
              </th>
              <th scope="col"><button type="button" className="btn btn-light btn-outline-success float-end" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => this.addClick()}>Create</button></th>
            </tr>
          </thead>
          <tbody>
            {movies.map(mv =>
              <tr key={mv.movieId}>
                <td>{mv.movieId}</td>
                <td>{mv.title}</td>
                <td>{mv.description}</td>
                <td>
                  <button type="button" className="btn btn-light btn-outline-danger" onClick={() => this.deleteMovie(mv.movieId)}>Delete</button>
                  <button type="button" className="btn btn-light btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => this.editClick(mv.movieId)}>Edit</button>
                  <button type="button" className="btn btn-light btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#moviesModal" onClick={() => { this.actorsinmovie(mv.movieId) }}>View</button>
                </td>
              </tr>)}
          </tbody>
        </table>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModal" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {movieId === 0 ? 'Add Movie' : 'Edit Movie'}
                </h5>

                <div className="modal-body">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Title</span>
                    <input type="text"
                      value={title}
                      onChange={this.changetitle}
                      className="form-control"
                      placeholder="Title"
                      aria-label="Title"
                      name="title" />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Description</span>
                    <input type="text"
                      value={description}
                      onChange={this.changedescription}
                      className="form-control"
                      placeholder="Description"
                      aria-label="Description"
                      name="description" />
                  </div>

                  {movieId == 0 ?
                    <button type="button" className="btn btn-primary float-start" onClick={() => this.createClick()}>Add</button> : null
                  }

                  {movieId != 0 ?
                    <button type="button" className="btn btn-primary float-start" onClick={() => this.updateClick()}>Save</button> : null
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="moviesModal" tabIndex="-1" aria-labelledby="moviesModal" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Actors
                </h5>
                <div className="modal-body">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Age</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actors.map(actrs =>
                        <tr key={actrs.actorId}>
                          <td>{actrs.firstName}</td>
                          <td>{actrs.lastName}</td>
                          <td>{actrs.age}</td>
                          <td>
                            <button type="button" className="btn btn-light btn-outline-danger" onClick={() => this.deletefrommovie(actrs.actorId)}>Delete</button>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}