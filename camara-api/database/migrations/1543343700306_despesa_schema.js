'use strict'

const Schema = use('Schema')

class DespesaSchema extends Schema {
  up () {
    this.create('despesas', (table) => {
      table.increments()
      table.integer('ano').unsigned()
      table.integer('mes').unsigned()
      table.string('tipoDespesa', 255)
      table.integer('idDocumento', 255)
      table.string('tipoDocumento', 255)
      table.integer('idTipoDocumento', 255)
      table.string('dataDocumento', 255)
      table.string('numDocumento', 255)
      table.decimal('valorDocumento', 12, 2)
      table.string('urlDocumento', 255)
      table.string('nomeFornecedor', 255)
      table.string('cnpjCpfFornecedor', 255)
      table.decimal('valorLiquido', 12, 2)
      table.decimal('valorGlosa', 12,2)
      table.string('numRessarcimento', 255)
      table.integer('idLote', 255)
      table.integer('parcela', 255)
      table.timestamps()
    })
  }

  down () {
    this.drop('despesas')
  }
}

module.exports = DespesaSchema
