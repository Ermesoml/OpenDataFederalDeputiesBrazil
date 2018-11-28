'use strict'

const Deputado = use('App/Models/Deputado')
const camara = use('./camara.js')

class DeputadoController {
  async getListaDeputados({}){
    // camara.atualizarDados();

    const deputados = await Deputado.all()
    return deputados
  }
}

module.exports = DeputadoController
