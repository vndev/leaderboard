import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data';
import Task from './Task.jsx';
import User from './User.jsx';
import { Tasks } from '../api/tasks.js';
import UsersCollection from '../api/users.js';
import {Meteor} from 'meteor/meteor'
import Github from 'github-api'
import injectTapEventPlugin from 'react-tap-event-plugin';
 import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import RaisedButton from 'material-ui/lib/raised-button';

import AppBar from 'material-ui/lib/app-bar';
// Needed for onTouchTap 
// http://stackoverflow.com/a/34015469/988941 
injectTapEventPlugin();
// App component - represents the whole app
class App extends Component {
  constructor(props){
    super(props)
    this.github = new Github({
      token:Meteor.settings.public.githubToken,
      auth: 'oauth'
    });
    this.updateDatabase = this.updateDatabase.bind(this)
    this.searchUsers = this.searchUsers.bind(this)
  }
  updateDatabase(user, repos, currentUser){
    Meteor.call('calculateScoreGithub', user, repos, (err, score) => {
        if(currentUser){
          let updateData = currentUser
          updateData.github = user
          updateData.score = score.total
          updateData.languages = score.languages
          updateData.updatedAt = new Date()
          Meteor.call('updateUser', updateData)
          toastr.success('Update successful')
        }else{
          UsersCollection.insert({
            username: username,
            github: user,
            score: score.total,
            languages: score.languages,
            createdAt: new Date(), // current time
          });
          toastr.success('Insert successful')
        }
      })
  }
  searchUsers(searchApi, q, per_page = 100, page = 1) {
    searchApi.users({q:q, per_page, page}, (err, res)=>{
      if(!err && res && res.total_count){
       var userApi = this.github.getUser();
       res.items.forEach((item) => {
         
        userApi.show(item.login, (err, user) => {
            if(user){
              let currentUser = UsersCollection.findOne({username:user.login})
              let repos;
              if(user.type == 'Organization'){
                userApi.orgRepos(item.login, (err, repos) => {
                  if(!err)
                    this.updateDatabase(user, repos, currentUser)
                });
              }else{
                userApi.userRepos(item.login, (err, repos) => {  
                  if(!err)
                    this.updateDatabase(user, repos, currentUser)
                });  
              }// Clear form    
            }
            
          }); 
       })
      }
    })
    
  }
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const username = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    let currentUser = UsersCollection.findOne({username:username})
    var userApi = this.github.getUser();
    this.searchUsers(this.github.getSearch(), 'nguyễn')
    let repos;
    userApi.show(username, (err, user) => {
      if(user){
        if(user.type == 'Organization'){
           userApi.orgRepos(username, (err, repos) => {
             if(!err)
               this.updateDatabase(user, repos, currentUser)
          });
        }else{
          userApi.userRepos(username, (err, repos) => {  
            if(!err)
              this.updateDatabase(user, repos, currentUser)
          });  
        }// Clear form    
       ReactDOM.findDOMNode(this.refs.textInput).value = '';
      }
      
    });
  }
 
  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }
  renderUsers() {
    return this.props.users.map((user, index) => (
      <User key={user._id} user={user} order={index+1}/>
    ));
  }
 
  render() {
    return (
      <div>
        <AppBar
    title="Title"
    iconClassNameRight="muidocs-icon-navigation-expand-more"
  />
        <LeftNav open={true}>
          <MenuItem>Menu Item</MenuItem>
          <MenuItem>Menu Item 2</MenuItem>
        </LeftNav>
      
      <div className="container">
      
        <header>
          <h1>User List</h1>
          
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new users"
            />
          </form>
        </header>
 
        <ul>
          {this.renderUsers()}
        </ul>
        </div>
      </div>
    );
  }
}
App.propTypes = {
  tasks: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
};
 
export default createContainer(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    users: UsersCollection.find({}, { sort: { score: -1 } }).fetch(),
  };
}, App);