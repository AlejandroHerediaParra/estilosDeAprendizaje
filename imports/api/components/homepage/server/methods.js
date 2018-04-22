import { Meteor } from 'meteor/meteor'

import { Homepage } from '../homepage'
import base64Img from 'base64-img'

Meteor.methods({
  'Homepage.addImage' (path) {
    const url = '/home/alejandro/Documentos/necos-project/public/assets/homepage/home.jpg'
    let image = base64Img.base64Sync(url)
    Homepage.insert({image})
  },

  'Homepage.getImage' (path) {
    const url = '/home/alejandro/Documentos/necos-project/public/assets/homepage/home.jpg'
    let image = base64Img.base64Sync(url)
    Homepage.insert({image})
  }
})