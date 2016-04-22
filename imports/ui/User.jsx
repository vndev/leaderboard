import React, { Component, PropTypes } from 'react';
 
// User component - represents a single todo item
export default class User extends Component {
  render() {
    return (
      <li>{this.props.user.username}</li>
    );
  }
}
 
User.propTypes = {
  // This component gets the User to display through a React prop.
  // We can use propTypes to indicate it is required
  user: PropTypes.object.isRequired,
};