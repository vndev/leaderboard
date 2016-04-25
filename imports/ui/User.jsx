import React, { Component, PropTypes } from 'react';
import UsersCollection from '../api/users' 
// User component - represents a single todo item
export default class User extends Component {
  handleDelete(userId){
    UsersCollection.remove({_id: userId})
  }
  render() {
    return (
      <li>{this.props.order} {this.props.user.github.name || this.props.user.username} ({this.props.user.username}) - {this.props.user.score} <button type="button" onClick={this.handleDelete.bind(this, this.props.user._id)}>Delete</button></li>
    );
  }
}
 
User.propTypes = {
  // This component gets the User to display through a React prop.
  // We can use propTypes to indicate it is required
  user: PropTypes.object.isRequired,
};