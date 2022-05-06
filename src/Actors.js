import { tsConstructorType } from "@babel/types";
import React, { Component } from "react";
import { variables } from "./variables.js";


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
      movieIdVal: ''
    };
  }



  refreshList() {
    fetch(variables.API_URL + 'actors')
      .then(response => response.json())
      .then(data => this.setState({ actors: data }));
  }
  refreshListActorMovies() {
    fetch(variables.API_URL + 'actors/' + this.state.currentActor + '/movies')
      .then(response => response.json())
      .then(data => this.setState({ movies: data }));
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
    fetch(variables.API_URL + 'actors', {
      method: 'POST',
      body: JSON.stringify(json),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => this.setState({ actors: data }));
  }




  componentDidMount() {
    this.refreshList();

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
  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if (d > 0) {//Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {//Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(18);
    });
  }


  editClick(actr) {
    this.setState({
      modalTitle: 'Edit Actor',
      actorId: actr.actorId,
      firstname: actr.firstName,
      lastname: actr.lastName,
      age: actr.age
    });
  }

  createClick() {
    fetch(variables.API_URL + 'actors', {
      method: 'POST',
      body: JSON.stringify({
        actorId: this.generateUUID(),
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        age: this.state.age
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result => {
        alert("success");
        this.refreshList();
      }, error => {
        alert("failed");
      })

  }

  updateClick() {
    fetch(variables.API_URL + 'actors/' + this.state.actorId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        actorId: this.state.actorId,
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        age: this.state.age
      }),

    })
      .then(response => response.json())
      .then(result => {
        alert("success");
        this.refreshList();
        this.closeModal();
      }, error => {
        console.log(error);
        this.refreshList();
      })

  }

  deleteClick(id) {
    fetch(variables.API_URL + 'actors/' + id, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result => {
        alert(result);
        this.refreshList();
      }, error => {
        this.refreshList();
        console.log(error);
      })
  }

  actormovies(id) {
    fetch(variables.API_URL + 'actors/' + id + '/movies')
      .then(response => response.json())
      .then(data => this.setState({ movies: data }));
    this.setState({ movies: [] });
    this.setState({ currentActor: id });
  }
  handleChange = (e) => {
    this.setState({ movieIdVal: e.target.value });
    console.log(this.state.movieIdVal);
  }

  getallmovies(id) {
    fetch(variables.API_URL + 'movies')
      .then(response => response.json())
      .then(data => this.setState({ allmovies: data }));
    this.setState({ currentActor: id });
    console.log(this.currentActor)
  }

  addactortomovie() {
    fetch(variables.API_URL + 'actors/' + this.state.currentActor + '/movie/' + this.state.movieIdVal, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        actorId: this.state.currentActor,
        movieId: this.state.movieIdVal
      }),
    })
      .then(response => response.json())
      .then(result => {
        alert("success");
        this.refreshList();
      }, error => {
        console.log(this.state.value)
      })
    console.log(this.state.movieIdVal, this.state.currentActor);
    this.setState({ currentActor: '' });

  }

  deletefrommovie(movieid) {
    fetch(variables.API_URL + 'actors/' + this.state.currentActor + '/movie/' + movieid, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result => {
        this.refreshList();
      }, error => {
        console.log(error);
      })
  }




  render() {
    const { actors, firstname, lastname, age, actorId, movies, allmovies, movieIdVal } = this.state;

    return (
      <div>
        <button type="button" className="btn btn-light btn-outline-success float-start  " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => this.addClick()}>Create</button>
        <div className="input-group mb-2">
          <input type="text" className="form-control float-end" placeholder="Search" aria-label="Search" aria-describedby="basic-addon2" style={{ width: "100px" }} onChange={this.handleChange} />

        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Age</th>

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
                  <button type="button" className="btn btn-light btn-outline-success" data-bs-toggle="modal" data-bs-target="#addModal" onClick={() => this.getallmovies(actr.actorId)}>Add</button>
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
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>

                      </tr>
                    </thead>
                    <tbody>
                      {movies.map(movie =>
                        <tr key={movie.movieId}>
                          <td>{movie.title}</td>
                          <td>{movie.description}</td>
                          <td>
                            <button type="button" className="btn btn-light btn-outline-danger" onClick={() => { this.deletefrommovie(movie.movieId); this.refreshListActorMovies() }}>Delete</button>
                          </td>
                        </tr>)}
                    </tbody>
                  </table>
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