import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class Welcome extends Component {

  createProfile() {
    Meteor.call('profiles.create');
  }

  render() {
    return (
      <div id="welcome">
        <h1>Welcome to the werewolf game</h1>
        <button onClick={this.createProfile.bind(this)}>
            Create profile
        </button>
      </div>
    );
  }
}
