'use strict'

const Despesa = use('App/Models/Despesa')

class DespesaController {
  async getListaDespesas({params}){
    // camara.atualizarDados();

    const despesas = await Despesa.query().where('deputadoId', params.deputadoId).orderBy('mes').fetch();
    return despesas
  }
}

module.exports = DespesaController
