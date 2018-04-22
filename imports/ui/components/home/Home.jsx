import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { render } from 'react-dom'

import { Homepage } from '/imports/api/components/homepage/homepage'


class Home extends React.Component {

  openMenu() {
    Meteor.call('Homepage.addImage', 'faekebaseurl')
    $('.ui.sidebar').sidebar({context: $('.bottom.segment')})
      .sidebar('attach events', '.menu .item')
  }

  render() {
    const documents = this.props.documents || []
    const { image } = documents[0] || '' 
    return (
      <div className='principal'>
        <div onClick={(e) => {this.openMenu()}} className="ui top attached menu bar">
          <a className="item">
            <i className="sidebar icon"></i>
            Menu
          </a>
        </div>
        <div className="ui bottom attached segment pushable page">
          <div className="ui inverted labeled icon left inline vertical sidebar menu">
            <a className="item">
              <i className="home icon"></i>
              Inicio
            </a>
            <a className="item">
              <i className="soccer icon"></i>
              Complejo
            </a>
            <a className="item">
              <i className="spoon icon"></i>
              Restaurant
            </a>
            <a className="item">
              <i className="calendar icon"></i>
              Eventos
            </a>
            <a className="item">
              <i className="sticky note icon"></i>
              Reservas
            </a>
          </div>
          <div className="pusher">
            <div className="ui basic segment content">
                <div className='background'>
                  <img className='image' src={image} alt="Red dot" />
                </div>
                <div className='complex'>
                  <img className='image' src={image} alt="Red dot" />
                </div>
                <div className='restaurant'>
                  <img className='image' src={image} alt="Red dot" />
                </div>
                <div className='events'>
                  <img className='image' src={image} alt="Red dot" />
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomeContainer = createContainer(() => {
  Meteor.subscribe("homepage");
  const documents = Homepage.find().fetch();
  console.log(documents)
  return { documents };
}, Home);
