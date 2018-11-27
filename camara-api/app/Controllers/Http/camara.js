const axios = require('axios');
const Deputado = use('App/Models/Deputado')

module.exports = {
  async atualizarDados(){
    await this.atualizarDeputados('https://dadosabertos.camara.leg.br/api/v2/deputados?itens=100&ordem=ASC&ordenarPor=nome');

    const deputados = await Deputado.all()

    deputados.rows.forEach(deputado => {
      this.atualizarDespesas(`https://dadosabertos.camara.leg.br/api/v2/deputados/${deputado.deputadoId}/despesas?itens=100&ordem=ASC&ordenarPor=ano`);
    });
  },
  async atualizarDeputados(uri){
    await axios.get(uri).then(async (response) => {
        for (let i = 0; i < response.data.dados.length; i++) {
          let dadosDeputado = await axios.get(response.data.dados[i].uri).then(async (response) => {
            return response.data.dados;
          })
          .catch((error) => {
            return error;
          })
          await this.atualizarDeputado(dadosDeputado); 
        }

        for (let j = 0; j < response.data.links.length; j++) {
          if (response.data.links[j].rel === "next")
            await this.atualizarDeputados(response.data.links[j].href);
        }
      })
      .catch((error) => {
        console.log(error);
      })
  },
  async atualizarDeputado(deputado){
    const deputado_banco = await Deputado.query().where('deputadoId', deputado.id).fetch();

    try {
      if (deputado_banco.rows.length > 0){
        var deputadoAtualizar = await Deputado.find(deputado_banco.rows[0].id);
      }
      else {
        var deputadoAtualizar = new Deputado();
      }
        
      deputadoAtualizar.deputadoId = deputado.id;
      deputadoAtualizar.uri = deputado.uri;
      deputadoAtualizar.nome = deputado.ultimoStatus.nomeEleitoral;
      deputadoAtualizar.nomeCivil = deputado.nomeCivil;

      deputadoAtualizar.siglaPartido = deputado.ultimoStatus.siglaPartido;
      deputadoAtualizar.uriPartido = deputado.ultimoStatus.uriPartido;
      deputadoAtualizar.siglaUf = deputado.ultimoStatus.siglaUf;

      deputadoAtualizar.idLegislatura = deputado.ultimoStatus.idLegislatura;
      deputadoAtualizar.urlFoto = deputado.ultimoStatus.urlFoto;
      deputadoAtualizar.sexo = deputado.sexo;
      deputadoAtualizar.ufNascimento = deputado.ufNascimento;
      deputadoAtualizar.municipioNascimento = deputado.municipioNascimento;
      deputadoAtualizar.escolaridade = deputado.escolaridade;

      deputadoAtualizar.gabineteNome = deputado.ultimoStatus.gabinete.nome;
      deputadoAtualizar.gabinetePredio = deputado.ultimoStatus.gabinete.predio;
      deputadoAtualizar.gabineteSala = deputado.ultimoStatus.gabinete.sala;
      deputadoAtualizar.gabineteAndar = deputado.ultimoStatus.gabinete.andar;
      deputadoAtualizar.gabineteTelefone = deputado.ultimoStatus.gabinete.telefone;
      deputadoAtualizar.gabineteEmail = deputado.ultimoStatus.gabinete.email;

      var retorno = await deputadoAtualizar.save()
    }
    catch(error){
      console.log(error)
    }
    return retorno
  },
  async atualizarDespesas(uri){
    await axios.get(uri).then(async (response) => {
      let dadosDespesa = response.data.dados;
      console.log(dadosDespesa);
       
      for (let j = 0; j < response.data.links.length; j++) {
        if (response.data.links[j].rel === "next")
          await this.atualizarDespesas(response.data.links[j].href);
      }
    })
    .catch((error) => {
      console.log(error);
    })  
  },
}