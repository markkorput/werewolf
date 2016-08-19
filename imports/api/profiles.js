import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Profiles = new Mongo.Collection('profiles');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish tasks that are public or belong to the current user
  Meteor.publish('userprofiles', function allProfilesPublication() {
    return Profiles.find({ owner: this.userId });
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
});