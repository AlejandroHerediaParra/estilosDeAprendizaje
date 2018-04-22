import { Meteor  } from 'meteor/meteor'

import { Homepage } from '../homepage'

Meteor.publish('homepage',  function () {
  return Homepage.find();
});