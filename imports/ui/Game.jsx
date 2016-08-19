import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// import { Meteor } from 'meteor/meteor';

export default class Game extends Component {

  leaveGame() {
    Meteor.call('profiles.leaveGame');
  }

  renderProfiles(){
    return this.props.game.profiles().map((profile) => {
        return <li>{profile.alias}</li>
    });
  }

  render() {
    return (
      <div id="game">
        <h1>Game</h1>
        <span className="status">{this.props.game.status}</span>
        <button onClick={this.leaveGame.bind(this)}>
            Leave Game
        </button>

        <h2>Players</h2>
        <ul>
            {this.renderProfiles()}
        </ul>
      </div>
    );
  }
}

Game.propTypes = {
    game: React.PropTypes.object.isRequired,
    profile: React.PropTypes.object.isRequired,
};