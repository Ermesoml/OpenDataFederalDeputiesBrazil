const axios = require('axios');
const Deputado = use('App/Models/Deputado')
const Despesa = use('App/Models/Despesa')

axios.defaults.headers['charset'] = 'utf-8';

module.exports = {
  despesas: [],
  despesasGravadas: 0,
  async atualizarDados(){
    // await this.atualizarDeputados('https://dadosabertos.camara.leg.br/api/v2/deputados?itens=100&ordem=ASC&ordenarPor=nome');

    const deputados = await Deputado.all()

    for (let i = 0; i < deputados.rows.length; i++) {
      console.log('Buscando despesas do deputado: ' + deputados.rows[i].nome)
      if (i > 10)
        await this.atualizarDespesas(deputados.rows[i].deputadoId, `https://dadosabertos.camara.leg.br/api/v2/deputados/${deputados.rows[i].deputadoId}/despesas?ano=2018?itens=100&ordem=ASC&ordenarPor=ano`); 
    }
    
    // console.log(`Atualizando despesas no banco. Total: ${this.despesas.length}`)
    // for (let j = 0; j < this.despesas.length; j++) {
    //   console.log(`Atualizando despesa: ${j+1} de ${this.despesas.length}`)
    //   this.atualizarDespesaBanco(this.despesas[j]);
    // }
    // console.log('Despesas atualizadas')
  },
  async atualizarDeputados(uri){
    let response = await axios.get(uri).then(async (response) => {
        return response
      })
      .catch((error) => {
        console.log(error);
      });

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
  },
  async atualizarDeputado(deputado){
    const deputado_banco = await Deputado.query().where('deputadoId', deputado.id).fetch();

    try {
      if (deputado_banco.rows.length > 0){
        var deputadoAtualizar = await Deputado.find(deputado_banco.rows[0].id);
        console.log('Atualizando deputado: ' + deputado.ultimoStatus.nomeEleitoral)
      }
      else {
        var deputadoAtualizar = new Deputado();
        console.log('Inserindo deputado: ' + deputado.ultimoStatus.nomeEleitoral)
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
  async atualizarDespesas(deputadoId, uri){
    await axios.get(uri).then(async (response) => {
      let dadosDespesa = response.data.dados;
      dadosDespesa.map((despesa) => {
        despesa.deputadoId = deputadoId
        this.atualizarDespesaBanco(despesa);
        this.despesasGravadas++;
        console.log(this.despesasGravadas);
      })
      // this.despesas = [...this.despesas, ...dadosDespesa];
      // for (let i = 0; i < dadosDespesa.length; i++) {
      //   this.atualizarDespesa(deputadoId, dadosDespesa[i]);
      // }
       
      for (let j = 0; j < response.data.links.length; j++) {
        if (response.data.links[j].rel === "next" && response.data.links[j].href != undefined)
          await this.atualizarDespesas(deputadoId, response.data.links[j].href);
      }
    })
    .catch((error) => {
      console.log(error)
    })  
  },
  async atualizarDespesaBanco(despesa){
    try {
      const despesa_banco = await Despesa.query().where('idDocumento', despesa.idDocumento).where('deputadoId', despesa.deputadoId).fetch();
      if (despesa_banco.rows.length > 0){
        var despesaAtualizar = await Despesa.find(despesa_banco.rows[0].id);
      }
      else {
        var despesaAtualizar = new Despesa();
      }
        
      despesaAtualizar.deputadoId = despesa.deputadoId;
      despesaAtualizar.ano = despesa.ano;
      despesaAtualizar.mes = despesa.mes;
      despesaAtualizar.tipoDespesa = despesa.tipoDespesa;
      despesaAtualizar.idDocumento = despesa.idDocumento;
      despesaAtualizar.tipoDocumento = despesa.tipoDocumento;
      despesaAtualizar.idTipoDocumento = despesa.idTipoDocumento;
      despesaAtualizar.dataDocumento = despesa.dataDocumento;
      despesaAtualizar.numDocumento = despesa.numDocumento;
      despesaAtualizar.valorDocumento = despesa.valorDocumento;
      despesaAtualizar.urlDocumento = despesa.urlDocumento;

      // despesaAtualizar.nomeFornecedor = despesa.nomeFornecedor;
      despesaAtualizar.cnpjCpfFornecedor = despesa.cnpjCpfFornecedor;
      despesaAtualizar.valorLiquido = despesa.valorLiquido;
      despesaAtualizar.valorGlosa = despesa.valorGlosa;
      despesaAtualizar.numRessarcimento = despesa.numRessarcimento;
      despesaAtualizar.idLote = despesa.idLote;
      despesaAtualizar.parcela = despesa.parcela;

      var retorno = await despesaAtualizar.save()
    }
    catch(error){
      console.log('Erro ao gravar despesa ' +  error)
    }
    return retorno
  },
}