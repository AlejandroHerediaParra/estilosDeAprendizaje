import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'
import { render } from 'react-dom'
import base64Img from 'base64-img'



export default class AdminHome extends React.Component {
  handleSubmit(e) {
    console.log(e.target.value)
    e.preventDefault();
  }

  handleChange(e) {
    console.log(base64Img)
    base64Img.base64(e.target.value, (err, data) => {
      console.log(err,data)
    } )
  }

  render() {
    const documents = this.props.documents || []
    const { image } = documents[0] || '' 
    return (
      <div className="ui inverted segment">
        <form onSubmit={this.handleSubmit}>
          <div className="ui inverted form">
            <div className="two fields">
              <div className="field">
                <label>Imagen Principal</label>
                <input type="file" onChange={this.handleChange}/>
              </div>
              <div className="field">
                <label>Imagen Complejo</label>
                <input type="file" onChange={this.handleChange}/>
              </div>
            </div>
            <div className="two fields">
              <div className="field">
                <label>Imagen Restaurante</label>
                <input type="file" onChange={this.handleChange}/>
              </div>
              <div className="field">
                <label>Imagen Eventos</label>
                <input type="file" onChange={this.handleChange}/>
              </div>
            </div>
            <input type='submit' className="ui submit button" value='Submit' />
          </div>
        </form>
      </div>
    );
  }
}
