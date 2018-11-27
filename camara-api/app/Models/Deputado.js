'use strict'

const Model = use('Model')

class Deputado extends Model {
  static get table () {
    return 'deputados'
  }
}

module.exports = Deputado
