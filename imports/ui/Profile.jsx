import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

export default class Profile extends Component {

  handleProfileUpdateSubmit(event) {
    event.preventDefault();
    
    const alias = ReactDOM.findDOMNode(this.refs.aliasInput).value.trim();
    Meteor.call('profiles.setAlias', this.props.profile._id, alias);
  }

  render() {
    return (
      <div id="profile">
        <h1>Profile Settings</h1>
        <form className="update-profile" onSubmit={this.handleProfileUpdateSubmit.bind(this)} >
            <input
                type="text"
                ref="aliasInput"
                defaultValue={this.props.profile.alias}
                placeholder="Give an alias for your player profile"
              />
              <input type="submit" />
        </form>
      </div>
    );
  }
}

Profile.propTypes = {
    profile: React.PropTypes.object.isRequired,
};