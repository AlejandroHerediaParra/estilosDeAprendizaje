import { Meteor } from 'meteor/meteor'

import { Homepage } from '../homepage'
import base64Img from 'base64-img'

Meteor.methods({
  'saveResult' (state) {
    Homepage.insert(state)
  },

  'Homepage.getImage' (path) {
    const url = '/home/alejandroattack/Documents/projects/reneProject/public/assets/homepage/home.jpg'
    let image = base64Img.base64Sync(url)
    Homepage.insert({image})
  }
})