'use strict'

const Model = use('Model')

class Despesa extends Model {
  static get table () {
    return 'despesas'
  }
}

module.exports = Despesa
