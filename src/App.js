import React, { Component, Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar.js';
import Users from './components/users/Users.js';
import Search from './components/users/Search.js';
import Alert from './components/layout/Alert.js';
import About from './components/pages/About.js';
import User from './components/users/User.js';
import axios from 'axios';
import './App.css';

class App extends Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
    repos: []
  }
  
  // Search Github users
  searchUsers = async (text) => {
    this.setState({ loading: true});
    
    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=$
    {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
    {process.env.REACT_APP_GITHUB_CLIENT_SECRET`);
    
    this.setState({users: res.data.items, loading: false});
  };

  // Get single GitHub user

  getUser = async (username) => {
    this.setState({ loading: true});
    
    const res = await axios.get(`https://api.github.com/users/${username}?client_id=$
    {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
    {process.env.REACT_APP_GITHUB_CLIENT_SECRET`);
    
    this.setState({user: res.data, loading: false});
  }

  // Get users repos

  getUserRepos = async (username) => {
    this.setState({ loading: true});
    
    const res = await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=$
    {process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=$
    {process.env.REACT_APP_GITHUB_CLIENT_SECRET`);
    
    this.setState({repos: res.data, loading: false});
  }


  clearUsers = () => this.setState({users: [], loading: false});

  setAlert = (msg, type) => {
    this.setState({alert:  { msg, type }});

    setTimeout(() => this.setState({alert: null}), 5000);
  }


  render() {
    const { users, loading, user, repos } = this.state;
    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <Alert alert={this.state.alert} />
          <Switch>
            <Route exact path="/" render={props => (
              <Fragment>
                <Search 
                  searchUsers={this.searchUsers} 
                  clearUsers={this.clearUsers} 
                  showClear={ users.length > 0 ? true : false }
                  setAlert={this.setAlert} />
                <Users loading={loading} users={users} />
              </Fragment>
            )} />
            <Route exact path="/about" component={About} />
            <Route exact path="/user/:login" render={(props) => (
              <User {...props} getUser={this.getUser} getUserRepos={this.getUserRepos} user={user} repos={repos} loading={loading} />
            )} />
          </Switch>

        </div>
      </div>
    );
  }
}

export default App;
