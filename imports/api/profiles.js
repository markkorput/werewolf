import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Games } from './games.js'

export const Profiles = new Mongo.Collection('profiles');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish profiles that belong to the current user
  Meteor.publish('userprofiles', function userProfilesPublication() {
    return Profiles.find({ owner: this.userId });
  });

  Meteor.publish('usergameprofiles', function userGameProfilesPublication(){
    // find user's profile
    const profile = Profiles.find({owner: this.userId}).fetch()[0];
    // find the game that the user has joined
    const game = profile && profile.game()
    // show all profiles that have joined the same game
    return game && game.profiles();
  });
}

Meteor.methods({
  'profiles.create'(alias) {
    if(!alias)
      alias = '';

    check(alias, String);

    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Only allow one profile-per-user
    if(Profiles.find({ owner: this.userId }).count() > 0){
      throw new Meteor.Error('user-already-has-a-profile');
    }

    Profiles.insert({
      alias: alias,
      createdAt: new Date(),
      owner: this.userId,
    });
  },

  'profiles.setAlias'(profileId, alias) {
    check(profileId, String);
    check(alias, String);
 
    const profile = Profiles.findOne(profileId);

    // Make sure only the task owner can make a task private
    if (profile.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Profiles.update(profileId, { $set: { alias: alias } });
  },
  
  'profiles.joinPendingGame'() {
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Get user's profile
    const profile = Profiles.find({ owner: this.userId }).fetch()[0];

    // Profile is required
    if(!profile){
      throw new Meteor.Error('no-profile');
    }

    // Find pending game
    let game = Games.find({status: 'pending'}).fetch()[0];
    let game_id = undefined;

    if(game){
      game_id = game._id;
    } else {
      game_id = Games.insert({
        createdAt: new Date(),
        status: 'pending'
      });
    }

    // Profile is required
    if(!game_id){
      throw new Meteor.Error('no-game');
    }

    Profiles.update(profile._id, { $set: { game_id: game_id } });
  },

  'profiles.leaveGame'() {
    // Make sure the user is logged in before inserting a task
    if (! this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    // Get user's profile
    const profile = Profiles.find({ owner: this.userId }).fetch()[0];

    // Profile is required
    if(!profile){
      throw new Meteor.Error('no-profile');
    }

    Profiles.update(profile._id, { $unset: {game_id: ''}})
  }
});

Profiles.helpers({
  game(){
    return this.game_id && Games.findOne(this.game_id);
  }
});