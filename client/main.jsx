import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'

import HomeContainer from '/imports/ui/components/home/Home'
import '/imports/startup/client/index'

Meteor.startup(() => {
    render(<HomeContainer />, document.getElementById('necos-app'));
});
