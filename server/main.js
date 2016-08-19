import { Meteor } from 'meteor/meteor';

import '../imports/api/tasks.js';
import '../imports/api/profiles.js';

import { Accounts } from 'meteor/accounts-base';
import { AccountsGuest } from 'meteor/artwells:accounts-guest';

Meteor.startup(() => {
  // code to run on server at startup
  Accounts.removeOldGuests()
  AccountsGuest.name = true
  AccountsGuest.forced = true;
  AccountsGuest.enable = true;
  AccountsGuest.anonymous = true;
});
