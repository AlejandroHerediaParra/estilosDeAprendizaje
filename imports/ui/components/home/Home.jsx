import React from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { render } from 'react-dom'
import _ from 'underscore'

import { Homepage } from '/imports/api/components/homepage/homepage'

function calculateEC(state) {
  let result = 0
  const {
    pregunta2: {soyReceptivo},
    pregunta3: {siento},
    pregunta4: {aceptoLaSituacion},
    pregunta5: {actuoPorIntuicion},
    pregunta7: {estoyOrientadoHaciaElPresente},
    pregunta8: {meApoyoEnLaSuma}
  } = state
  result += soyReceptivo + siento + aceptoLaSituacion + actuoPorIntuicion + estoyOrientadoHaciaElPresente + meApoyoEnLaSuma
  return result
}

function calculateOR(state) {
  let result = 0
  const {
    pregunta1: {hagoIntentos},
    pregunta3: {observo},
    pregunta6: {prefieroLaObservacion},
    pregunta7: {reflexiono},
    pregunta8: {observoP8},
    pregunta9: {soyReservado}
  } = state
  result += hagoIntentos + observo + prefieroLaObservacion + reflexiono + observoP8 + soyReservado
  return result
}

function calculateCA(state) {
  let result = 0
  const {
    pregunta2: {analizo},
    pregunta3: {pienso},
    pregunta4: {evaluoLaSituacion},
    pregunta5: {actuoConLogica},
    pregunta8: {conceptualizo},
    pregunta9: {soyRadical}
  } = state
  result += analizo + pienso + evaluoLaSituacion + actuoConLogica + conceptualizo + soyRadical
  return result
}

function calculateEA(state) {
  let result = 0
  const {
    pregunta1: {soyPractico},
    pregunta3: {actuo},
    pregunta6: {prefieroLaAccion},
    pregunta7: {soyPragmatico},
    pregunta8: {experimento},
    pregunta9: {tomoMisResponzabilidades}
  } = state
  result += soyPractico + actuo + prefieroLaAccion + soyPragmatico + experimento + tomoMisResponzabilidades
  return result
}

function getEjeResult(CAECResult, EAORResult) {
  if (CAECResult < 3 && EAORResult > 3) {
    return "Adaptador"
  }
  if (CAECResult < 3 && EAORResult < 3) {
    return "Divergente"
  }
  if (CAECResult > 3 && EAORResult > 3) {
    return "Convergente"
  }
  if (CAECResult > 3 && EAORResult < 3) {
    return "Asimilador"
  }
  return ""
}

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      experienciaConcreta: 0,
      observaciónReflexiva: 0,
      conceptualizaciónAbstracta: 0,
      experimentaciónActiva: 0,
      CAECResult: 0,
      EAORResult: 0,
      ejeResult: "",
      pregunta1: {hagoElecciones: 0, hagoIntentos: 0, meComprometo: 0, soyPractico: 0},
      pregunta2: {soyReceptivo: 0, meEsfuerzoPor: 0, analizo: 0, soyImparcial: 0},
      pregunta3: {siento: 0, observo: 0, pienso: 0, actuo: 0},
      pregunta4: {aceptoLaSituacion: 0, noArriesgo: 0, evaluoLaSituacion: 0, estoyAtento:0},
      pregunta5: {actuoPorIntuicion: 0, obtengoResultados: 0, actuoConLogica: 0, meCuestiono: 0},
      pregunta6: {prefieroLaAbstraccion: 0, prefieroLaObservacion: 0, prefieroLasCosasConcretas: 0, prefieroLaAccion: 0},
      pregunta7: {estoyOrientadoHaciaElPresente: 0, reflexiono: 0, estoyOrientadoHaciaElFuturo: 0, soyPragmatico:0},
      pregunta8: {meApoyoEnLaSuma: 0, observoP8: 0, conceptualizo: 0, experimento: 0},
      pregunta9: {estoyConcentrado: 0, soyReservado: 0, soyRadical: 0, tomoMisResponzabilidades: 0},
      error:""
    }
  }

  openMenu() {
    Meteor.call('Homepage.addImage', 'faekebaseurl')
    $('.ui.sidebar').sidebar({context: $('.bottom.segment')})
      .sidebar('attach events', '.menu .item')
  }

  handleChange(e) {
    const {name, value, id} = e.target
    const newValue = this.state
    newValue[id][name] = parseInt(value)
    this.setState(newValue)
    if (id === "pregunta1") {
      const {pregunta1} = this.state
      const reviewPregunta1 = _.omit(pregunta1, name)
      const thereIsValue = _.some(reviewPregunta1, (val, key) => {
        return _.some(_.omit(pregunta1, key), otherValue => otherValue == val && otherValue != 0)
      })

    const emptyValues = _.some(reviewPregunta1, val => val == 0)
    if (thereIsValue) {
        this.setState({error: "No selecciones más de una respuesta por columna"})
      } else if (emptyValues){
        this.setState({error: "En esta pregunta debes introducir una respuesta por fila"})
      } else {
        this.setState({error: ""})
      }
    }
  }

  
  handleSubmit(state) {
    const ECResult = calculateEC(state)
    const ORResult = calculateOR(state)
    const CAResult = calculateCA(state)
    const EAResult = calculateEA(state)
    const CAECResult = CAResult - ECResult
    const EAORResult = EAResult - ORResult
    const ejeResult = getEjeResult(CAECResult, EAORResult)

    const result = {
      experienciaConcreta: ECResult,
      observaciónReflexiva: ORResult,
      conceptualizaciónAbstracta: CAResult,
      experimentaciónActiva: EAResult,
      CAECResult,
      EAORResult,
      ejeResult
    }
    this.setState(result, () =>{
      Meteor.call("saveResult", this.state, (err, resul) => {
        if(!err) {
          console.log("Result saved", resul)
        } else {
          console.log("Result error", err)
        }
      })

    })
  }

  render() {
    const {
      pregunta1: {hagoElecciones, hagoIntentos, meComprometo, soyPractico},
      error,
      ejeResult
    } = this.state
    return (
      <div className="ui inverted segment">
        <form onSubmit={this.handleSubmit} action="">
          <div className="ui inverted form">
            <div className="one field" style={{padding: '25px 150px'}}>
              <div className="field">
                <label className="title">PREGUNTA 1 (Aprendo mejor cuando) *</label>
                <label className="description">Recuerda, no puedes repetir en dos filas el mismo numero, son 4 filas donde donde se debe puntuar con un numero las alternativas. Vea la imagen de ejemplo</label>
                <table className="ui inverted table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Hago elecciones</td>
                      <td><input checked={hagoElecciones === 1} onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="hagoElecciones" id="pregunta1"/></td>
                      <td><input checked={hagoElecciones === 2} onChange={(e) => {this.handleChange(e)}}type="radio" value={2} name="hagoElecciones" id="pregunta1"/></td>
                      <td><input checked={hagoElecciones === 3} onChange={(e) => {this.handleChange(e)}}type="radio" value={3} name="hagoElecciones" id="pregunta1"/></td>
                      <td><input checked={hagoElecciones === 4} onChange={(e) => {this.handleChange(e)}}type="radio" value={4} name="hagoElecciones" id="pregunta1"/></td>
                    </tr>
                    <tr>
                      <td>Hago intentos</td>
                      <td><input checked={hagoIntentos === 1} onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="hagoIntentos" id="pregunta1"/></td>
                      <td><input checked={hagoIntentos === 2} onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="hagoIntentos" id="pregunta1"/></td>
                      <td><input checked={hagoIntentos === 3} onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="hagoIntentos" id="pregunta1"/></td>
                      <td><input checked={hagoIntentos === 4} onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="hagoIntentos" id="pregunta1"/></td>
                    </tr>
                    <tr>
                      <td>Me comprometo</td>
                      <td><input checked={meComprometo === 1} onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="meComprometo" id="pregunta1"/></td>
                      <td><input checked={meComprometo === 2} onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="meComprometo" id="pregunta1"/></td>
                      <td><input checked={meComprometo === 3} onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="meComprometo" id="pregunta1"/></td>
                      <td><input checked={meComprometo === 4} onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="meComprometo" id="pregunta1"/></td>
                    </tr>
                    <tr>
                      <td>Soy practico</td>
                      <td><input checked={soyPractico === 1} onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="soyPractico" id="pregunta1"/></td>
                      <td><input checked={soyPractico === 2} onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="soyPractico" id="pregunta1"/></td>
                      <td><input checked={soyPractico === 3} onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="soyPractico" id="pregunta1"/></td>
                      <td><input checked={soyPractico === 4} onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="soyPractico" id="pregunta1"/></td>
                    </tr>
                  </tbody>
                </table>
                <label style={{color: "red"}}>{error}</label>
              </div>
              <div className="field">
                <label className="title">PREGUNTA 2 (Aprendo mejor cuando)</label>
                <table className="ui inverted table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Soy receptivo</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="soyReceptivo" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="soyReceptivo" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="soyReceptivo" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="soyReceptivo" id="pregunta2"/></td>
                    </tr>
                    <tr>
                      <td>Me esfuerzo por <br/> ser pertinente</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="meEsfuerzoPor" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="meEsfuerzoPor" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="meEsfuerzoPor" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="meEsfuerzoPor" id="pregunta2"/></td>
                    </tr>
                    <tr>
                      <td>Analizo</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="analizo" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="analizo" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="analizo" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="analizo" id="pregunta2"/></td>
                    </tr>
                    <tr>
                      <td>Soy imparcial</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="soyImparcial" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="soyImparcial" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="soyImparcial" id="pregunta2"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="soyImparcial" id="pregunta2"/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="field">
                <label className="title">PREGUNTA 3 (Aprendo mejor cuando)</label>
                <table className="ui inverted table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Siento</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="siento" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="siento" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="siento" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="siento" id="pregunta3"/></td>
                    </tr>
                    <tr>
                      <td>Observo</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="observo" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="observo" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="observo" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="observo" id="pregunta3"/></td>
                    </tr>
                    <tr>
                      <td>Pienso</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="pienso" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="pienso" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="pienso" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="pienso" id="pregunta3"/></td>
                    </tr>
                    <tr>
                      <td>Actuo</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="actuo" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="actuo" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="actuo" id="pregunta3"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="actuo" id="pregunta3"/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="field">
                <label className="title">PREGUNTA 4 (Aprendo mejor cuando)</label>
                <table className="ui inverted table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Acepto la situacion</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="aceptoLaSituacion" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="aceptoLaSituacion" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="aceptoLaSituacion" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="aceptoLaSituacion" id="pregunta4"/></td>
                    </tr>
                    <tr>
                      <td>No arriesgo</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="noArriesgo" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="noArriesgo" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="noArriesgo" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="noArriesgo" id="pregunta4"/></td>
                    </tr>
                    <tr>
                      <td>Evaluo la situacion</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="evaluoLaSituacion" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="evaluoLaSituacion" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="evaluoLaSituacion" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="evaluoLaSituacion" id="pregunta4"/></td>
                    </tr>
                    <tr>
                      <td>Estoy atento</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="estoyAtento" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="estoyAtento" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="estoyAtento" id="pregunta4"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="estoyAtento" id="pregunta4"/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="field">
                <label className="title">PREGUNTA 5 (Aprendo mejor cuando)</label>
                <table className="ui inverted table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Actuó por intuición</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="actuoPorIntuicion" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="actuoPorIntuicion" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="actuoPorIntuicion" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="actuoPorIntuicion" id="pregunta5"/></td>
                    </tr>
                    <tr>
                      <td>Obtengo resultados</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="obtengoResultados" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="obtengoResultados" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="obtengoResultados" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="obtengoResultados" id="pregunta5"/></td>
                    </tr>
                    <tr>
                      <td>Actuó con lógica</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="actuoConLogica" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="actuoConLogica" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="actuoConLogica" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="actuoConLogica" id="pregunta5"/></td>
                    </tr>
                    <tr>
                      <td>Me cuestiono</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="meCuestiono" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="meCuestiono" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="meCuestiono" id="pregunta5"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="meCuestiono" id="pregunta5"/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="field">
                <label className="title">PREGUNTA 6 (Aprendo mejor cuando)</label>
                <table className="ui inverted table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Prefiero la abstracción</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="prefieroLaAbstraccion" id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="prefieroLaAbstraccion" id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="prefieroLaAbstraccion" id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="prefieroLaAbstraccion" id="pregunta6"/></td>
                    </tr>
                    <tr>
                      <td>Prefiero la observación</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="prefieroLaObservacion" id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="prefieroLaObservacion" id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="prefieroLaObservacion" id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="prefieroLaObservacion" id="pregunta6"/></td>
                    </tr>
                    <tr>
                      <td>Prefiero las cosas concretas</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="prefieroLasCosasConcretas"  id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="prefieroLasCosasConcretas"  id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="prefieroLasCosasConcretas"  id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="prefieroLasCosasConcretas"  id="pregunta6"/></td>
                    </tr>
                    <tr>
                      <td>Prefiero la accion</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="prefieroLaAccion" id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="prefieroLaAccion" id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="prefieroLaAccion" id="pregunta6"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="prefieroLaAccion" id="pregunta6"/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="field">
                <label className="title">PREGUNTA 7 (Aprendo mejor cuando)</label>
                <table className="ui inverted table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Estoy orientado hacia el presente</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="estoyOrientadoHaciaElPresente" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="estoyOrientadoHaciaElPresente" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="estoyOrientadoHaciaElPresente" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="estoyOrientadoHaciaElPresente" id="pregunta7"/></td>
                    </tr>
                    <tr>
                      <td>Reflexiono</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="reflexiono" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="reflexiono" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="reflexiono" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="reflexiono" id="pregunta7"/></td>
                    </tr>
                    <tr>
                      <td>Estoy orientado hacia el futuro</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="estoyOrientadoHaciaElFuturo" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="estoyOrientadoHaciaElFuturo" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="estoyOrientadoHaciaElFuturo" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="estoyOrientadoHaciaElFuturo" id="pregunta7"/></td>
                    </tr>
                    <tr>
                      <td>Soy pragmático</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="soyPragmatico" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="soyPragmatico" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="soyPragmatico" id="pregunta7"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="soyPragmatico" id="pregunta7"/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="field">
                <label className="title">PREGUNTA 8 (Aprendo mejor cuando)</label>
                <table className="ui inverted table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Me apoyo en la suma <br/> de las experiencias vividas</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="meApoyoEnLaSuma"  id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="meApoyoEnLaSuma"  id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="meApoyoEnLaSuma"  id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="meApoyoEnLaSuma"  id="pregunta8"/></td>
                    </tr>
                    <tr>
                      <td>Observo</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="observoP8"  id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="observoP8"  id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="observoP8"  id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="observoP8"  id="pregunta8"/></td>
                    </tr>
                    <tr>
                      <td>Conceptualizo</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="conceptualizo" id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="conceptualizo" id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="conceptualizo" id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="conceptualizo" id="pregunta8"/></td>
                    </tr>
                    <tr>
                      <td>Experimento</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="experimento" id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="experimento" id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="experimento" id="pregunta8"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="experimento" id="pregunta8"/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="field">
                <label className="title">PREGUNTA 9 (Aprendo mejor cuando)</label>
                <table className="ui inverted table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>1</th>
                      <th>2</th>
                      <th>3</th>
                      <th>4</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Estoy concentrado</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="estoyConcentrado" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="estoyConcentrado" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="estoyConcentrado" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="estoyConcentrado" id="pregunta9"/></td>
                    </tr>
                    <tr>
                      <td>Soy reservado</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="soyReservado" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="soyReservado" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="soyReservado" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="soyReservado" id="pregunta9"/></td>
                    </tr>
                    <tr>
                      <td>Soy radical</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="soyRadical" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="soyRadical" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="soyRadical" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="soyRadical" id="pregunta9"/></td>
                    </tr>
                    <tr>
                      <td>Tomo mis responsabilidades</td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={1} name="tomoMisResponzabilidades" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={2} name="tomoMisResponzabilidades" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={3} name="tomoMisResponzabilidades" id="pregunta9"/></td>
                      <td><input onChange={(e) => {this.handleChange(e)}} type="radio" value={4} name="tomoMisResponzabilidades" id="pregunta9"/></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button type='button' disabled={error} className="ui submit button" onClick={() => {this.handleSubmit(this.state)}}>Calcular</button>
              <label>Resultado: {ejeResult} </label>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('homepage')
  const documents = Homepage.find().fetch()
  return { documents }
})(Home)
