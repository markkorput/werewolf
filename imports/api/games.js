// import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
// import { check } from 'meteor/check';
import { Profiles } from './profiles.js'

export const Games = new Mongo.Collection('games');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('pendinggames', function allPendingGamesPublication() {
    return Games.find({ status: 'pending' });
  });
}

Games.helpers({
  profiles(){
    return Profiles.find({game_id: this._id});
  }
});