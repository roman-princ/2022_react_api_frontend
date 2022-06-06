import { tsConstructorType } from "@babel/types";
import React, { Component } from "react";
import { variables } from "./variables.js";
import "./index.css";
const axios = require('axios').default;



export class Actors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actors: [],
      firstName: '',
      lastName: '',
      age: 0,
      actorId: 0,
      modalTitle: '',
      movies: [],
      allmovies: [],
      currentActor: '',
      movieIdVal: '',

      actoridFilter: 0,
      firstnameFliter: '',
      lastnameFliter: '',
      actorsWithoutFilter: []


    };
  }



  refreshList() {
    axios.get(variables.API_URL + 'actors')
      .then(response => {
        this.setState({ actors: response.data });
        this.setState({ actorsWithoutFilter: response.data });
      }
      )
      .catch(error => {
        alert(error);
      }
      )
  }








  addActor(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const json = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      age: data.get('age')
    };
    axios.post(variables.API_URL + 'actors', {
      body: JSON.stringify(json)
    })
  }

  FilterFn() {
    var ActorsIdFilter = this.state.actoridFilter;
    var FirstNameFilter = this.state.firstnameFliter;
    var LastNameFilter = this.state.lastnameFliter;
    var AgeFilter = this.state.ageFliter;
    var filteredData = this.state.actorsWithoutFilter.filter(
      function (el) {
        return el.actorId.toString().toLowerCase().startsWith(ActorsIdFilter.toString().trim().toLowerCase())
          && el.firstName.toString().toLowerCase().startsWith(FirstNameFilter.toString().trim().toLowerCase())
          && el.lastName.toString().toLowerCase().startsWith(LastNameFilter.toString().trim().toLowerCase())
      });
    this.setState({ actors: filteredData });


  }

  componentDidMount() {
    this.refreshList();
  }
  changeActorIdFilter = (e) => {
    this.state.actoridFilter = e.target.value;
    this.FilterFn();

  }
  changeFirstNameFilter = (e) => {
    this.state.firstnameFliter = e.target.value;
    //this.setState({ firstnameFliter: e.target.value });
    this.FilterFn();
  }
  changeLastNameFilter = (e) => {
    this.state.lastnameFliter = e.target.value;
    //this.setState({ lastnameFliter: e.target.value });
    this.FilterFn();
  }


  changeactorfirstname = (e) => {
    this.setState({ firstname: e.target.value });
  }
  changeactorlastname = (e) => {
    this.setState({ lastname: e.target.value });
  }
  changeage = (e) => {
    this.setState({ age: e.target.value });
  }
  addClick = (e) => {
    this.setState({
      modalTitle: 'Add Actor',
      actorId: 0,
      firstname: '',
      lastname: '',
      age: 0
    });

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


  editClick(actr) {
    this.setState({
      actorId: actr.actorId,
      firstname: actr.firstName,
      lastname: actr.lastName,
      age: actr.age
    });
  }

  createClick() {
    axios.post(variables.API_URL + 'actors', {
      actorId: this.generateGUID(),
      firstName: this.state.firstname,
      lastName: this.state.lastname,
      age: this.state.age
    })
      .then(response => {
        this.refreshList();
      }
      )
      .catch(error => {
        console.log(error);
      }
      )
  }


  updateClick() {
    axios.put(variables.API_URL + 'actors/' + this.state.actorId, {
      firstName: this.state.firstname,
      lastName: this.state.lastname,
      age: this.state.age
    })
      .then(response => {
        this.refreshList();
      }
      )
      .catch(error => {
        alert(error);
      }
      )
  }


  deleteClick(id) {
    axios.delete(variables.API_URL + 'actors/' + id)
      .then(response => {
        this.refreshList();
      }
      )
      .catch(error => {
        alert(error);
      }
      )
  }


  actormovies(id) {
    axios.get(variables.API_URL + 'actors/' + id + '/movies')
      .then(response => {
        this.setState({ movies: response.data });
      }
      )
      .catch(error => {
        alert(error);
      }
      )
    this.setState({ currentActor: id });
  }

  handleChange = (e) => {
    this.setState({ movieIdVal: e.target.value });
    console.log(this.state.movieIdVal);
  }

  getallmovies(id) {
    axios.get(variables.API_URL + 'movies')
      .then(response => {
        this.setState({ allmovies: response.data });
      }
      )
      .catch(error => {
        alert(error);
      }
      )
    this.setState({ currentActor: id });
  }


  addactortomovie() {
    axios.post(variables.API_URL + 'actors/' + this.state.currentActor + '/movie/' + this.state.movieIdVal)
      .then(response => {
        this.refreshList();
      }
      )
      .catch(error => {
        console.log(error);
        alert(error);
      }
      )
    this.setState({ currentActor: '' });
  }


  deletefrommovie(movieid) {
    axios.delete(variables.API_URL + 'actors/' + this.state.currentActor + '/movies/' + movieid)
      .then(response => {
        this.refreshList();
        this.actormovies(this.state.currentActor);
      }
      )
      .catch(error => {
        alert(error);
      }
      )
  }

  movieswithoutactor(id) {
    axios.get(variables.API_URL + 'actors/' + id + '/movies/notin')
      .then(response => {
        this.setState({ allmovies: response.data });
      }
      )
      .catch(error => {
        alert(error);
      }
      )
    this.setState({ currentActor: id });
  }





  render() {
    const { actors, firstname, lastname, age, actorId, movies, allmovies, movieIdVal } = this.state;

    return (
      <div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>
                <input className="form-control m-2"
                  onChange={this.changeActorIdFilter}
                  placeholder="Id" />
                #
              </th>

              <th scope="col">
                <input className="form-control m-2"
                  onChange={this.changeFirstNameFilter}
                  placeholder="First Name" />
                First Name
              </th>
              <th scope="col">
                <input type="text" className="form-control m-2"
                  onChange={this.changeLastNameFilter}
                  placeholder="Last Name" />
                Last Name
              </th>
              <th scope="col">

                Age
              </th>
              <th scope="col">
                <button type="button" className="btn btn-light btn-outline-success float-end" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => this.addClick()}>Create</button>

              </th>
            </tr>
          </thead>
          <tbody>
            {actors.map(actr =>
              <tr key={actr.actorId}>
                <td>{actr.actorId}</td>
                <td>{actr.firstName}</td>
                <td>{actr.lastName}</td>
                <td>{actr.age}</td>


                <td>
                  <button type="button" className="btn btn-light btn-outline-danger" onClick={() => this.deleteClick(actr.actorId)}>Delete</button>
                  <button type="button" className="btn btn-light btn-outline-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => this.editClick(actr)}>Edit</button>
                  <button type="button" className="btn btn-light btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#moviesModal" onClick={() => { this.actormovies(actr.actorId) }}>View</button>
                  <button type="button" className="btn btn-light btn-outline-success" data-bs-toggle="modal" data-bs-target="#addModal" onClick={() => this.movieswithoutactor(actr.actorId)}>Add</button>
                </td>

              </tr>)}
          </tbody>
        </table >

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModal" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  {actorId === 0 ? 'Add Actor' : 'Edit Actor'}
                </h5>

                <div className="modal-body">
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">First Name</span>
                    <input type="text"
                      value={firstname}
                      onChange={this.changeactorfirstname}
                      className="form-control"
                      placeholder="First Name"
                      aria-label="First Name"
                      name="firstName" />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Last Name</span>
                    <input type="text"
                      value={lastname}
                      onChange={this.changeactorlastname}
                      className="form-control"
                      placeholder="Last Name"
                      aria-label="Last Name"
                      name="lastName" />
                  </div>
                  <div className="input-group mb-3">
                    <span className="input-group-text" id="basic-addon1">Age</span>
                    <input type="number"
                      value={age}
                      onChange={this.changeage}
                      className="form-control"
                      placeholder=""
                      aria-label="Age"
                      name="age" />
                  </div>
                  {actorId == 0 ?
                    <button type="button" className="btn btn-primary float-start" onClick={() => this.createClick()}>Add</button> : null
                  }

                  {actorId != 0 ?
                    <button type="button" className="btn btn-primary float-start" onClick={() => this.updateClick()}>Update</button> : null
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
                  Movies
                </h5>
                <div className="modal-body">
                  {movies.length == 0 ?
                    <h2>No movies</h2> : null
                  }
                  {movies.length != 0 ?
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th scope="col">First Name</th>
                          <th scope="col">Last Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {movies.map(movie =>
                          <tr key={movie.movieId}>
                            <td>{movie.title}</td>
                            <td>{movie.description}</td>
                            <td>
                              <button type="button" className="btn btn-light btn-outline-danger" onClick={() => this.deletefrommovie(movie.movieId)}>Delete</button>
                            </td>
                          </tr>)}
                      </tbody>
                    </table> : null
                  }

                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModal" aria-hidden="true">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add to Movie
                </h5>

                <div className="modal-body">
                  <form onSubmit={() => this.addactortomovie()}>
                    <select value={movieIdVal} onChange={this.handleChange}>
                      {allmovies.map(movie =>
                        <option key={movie.movieId} value={movie.movieId}>{movie.title}</option>
                      )}
                    </select>
                    <button type="submit" value="Submit" className="btn btn-outline-primary" >Add</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >


    );
  }
}