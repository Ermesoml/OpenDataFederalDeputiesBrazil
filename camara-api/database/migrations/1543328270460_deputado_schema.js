'use strict'

const Schema = use('Schema')

class DeputadoSchema extends Schema {
  up () {
    this.create('deputados', (table) => {
      table.increments()
      table.integer('deputadoId').unsigned()
      table.string('uri', 255).unsigned()
      table.string('nome', 255).notNullable()
      table.string('nomeCivil', 255).notNullable()

      table.string('siglaPartido', 255).notNullable()
      table.string('uriPartido', 255).notNullable()
      table.string('siglaUf', 2).notNullable()
      table.integer('idLegislatura').unsigned()
      table.string('urlFoto', 255).notNullable()

      table.string('sexo', 2)
      table.string('ufNascimento', 255)
      table.string('municipioNascimento', 255)
      table.string('escolaridade', 255)

      table.string('gabineteNome', 255)
      table.string('gabinetePredio', 255)
      table.string('gabineteSala', 10)
      table.string('gabineteAndar', 3)
      table.string('gabineteTelefone', 30)
      table.string('gabineteEmail', 255)

      table.timestamps()
    })
  }

  down () {
    this.drop('deputados')
  }
}

module.exports = DeputadoSchema
