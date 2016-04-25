import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data';
import Task from './Task.jsx';
import User from './User.jsx';
import { Tasks } from '../api/tasks.js';
import UsersCollection from '../api/users.js';
import {Meteor} from 'meteor/meteor'
import Github from 'github-api'
// App component - represents the whole app
class App extends Component {
  constructor(props){
    super(props)
    this.github = new Github({
      token:Meteor.settings.public.githubToken,
      auth: 'oauth'
    });
    this.updateDatabase = this.updateDatabase.bind(this)
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
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const username = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    let currentUser = UsersCollection.findOne({username:username})
    var userApi = this.github.getUser();
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