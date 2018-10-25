import { FlowRouter } from 'meteor/kadira:flow-router'
import { mount } from 'react-mounter'

import AdminHome from '/imports/ui/components/adminhome/AdminHome'
import Home from '/imports/ui/components/home/Home'


FlowRouter.route('/admin', {
  action() {
    mount(AdminHome, { })
  },
});

FlowRouter.route('/', {
    name: 'Home',
    action() {
      mount(Home, { })
    },
  });