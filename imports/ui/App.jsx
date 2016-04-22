import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom'
import { createContainer } from 'meteor/react-meteor-data';
import Task from './Task.jsx';
import User from './User.jsx';
 import { Tasks } from '../api/tasks.js';
 import { Users } from '../api/users.js';
// App component - represents the whole app
class App extends Component {
  handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Users.insert({
      username: text,
      createdAt: new Date(), // current time
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }
 
  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }
  renderUsers() {
    return this.props.users.map((user) => (
      <User key={user._id} user={user} />
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
    users: Users.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, App);