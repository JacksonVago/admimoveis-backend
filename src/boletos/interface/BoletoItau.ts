interface BoletoItau {
    etapa_processo_boleto: string, //Emissão - 'efetivacao' (usado para ambinte produtivo) Simulação de Emissão - 'validacao' (usado para testes)
    codigo_canal_operacao: string, ///Código do canal de operação 'API'
    beneficiario: {
        id_beneficiario: string, //Agência (4 dígitos) + Conta (7 dígitos) + DAC (1 dígito). Exemplo: 150000123450
    },
    dado_boleto: {
        descricao_instrumento_cobranca: string, //Tipo de cobrança. Preencher com 'boleto'
        tipo_boleto: string, //Deve ser indicado um dos tipos do boleto: 'a vista' 'proposta' - Proposta: Este tipo de boleto é utilizado para que seu cliente aceite uma oferta de produto ou serviço, um convite para fazer parte de uma associação ou até mesmo fazer uma doação. Não se esqueça que seu cliente deverá concordar com seu recebimento antes de sua emissão. O pagamento desse boleto não é obrigatório.
        codigo_carteira: string, //Deve ser informado algum dos códigos de carteiras disponíveis. Ver "Tabela de Carteiras".
        codigo_especie: string, //Espécie do título. Ver "Tabela de Espécies"
        valor_abatimento: string, //Valor do abatimento do título. Este valor não pode superar o valor da cobrança. Este valor que será subtraído do valor total da cobrança. Mesmo vencida, a cobrança será paga com abatimento. Formato do campo: 15 dígitos inteiros e 2 casas decimais
        data_emissao: string, //Data efetiva da transação comercial entre beneficiário e pagador. Pode ser igual ou menor a data de vencimento, mas não deve ser maior que a data de vencimento. Formato: AAAA-MM-DD. Caso a data de emissão informada seja posterior ao vencimento, será atribuída a data do registro para esse campo.
        pagamento_parcial: boolean, //Indicador de pagamento parcial. Caso não seja enviado, assume-se o padrão 'false'. 'true' - Aceita pagamento parcial. 'false' - Não aceita pagamento parcial.
        quantidade_maximo_parcial: number, //Obrigatório envio apenas quando indicado pagamento_parcial = true. Quantidade permitida de pagamentos parciais da cobrança, valor deve ser entre 1 e 99. Em caso de pagamento_parcial = false, não enviar o atributo de quantidade_maximo_parcial.
        forma_envio: string, //Deve ser indicado um dos tipos 'impressao' ou 'email'. Caso seja informado 'email', é obrigatório informar o campo dado_boleto > pagador > texto_endereco_email com um endereço de e-mail válido. Quando informado "e-mail" o campo "texto_endereco_email" se torna obrigatório, será realizado o envio do boleto, anexo ao e-mail informado nesse campo.
        pagador: {
            texto_endereço_email: string, //Caso seja informado 'email' no campo dado_boleto > forma_envio, é obrigatório informar um e-mail válido no campo dado_boleto > pagador > texto_endereço_email. Máximo caracteres: 250. É possível informar até três e-mails sparados por um ";", o primeiro endereço informado será atribuído como destinatário e os demais como cópia oculta, desde que respeitado o limite de 250 caracteres.
        },
        assunto_email: string, //O campo pode ser preenchido de forma personalizada. Máximo caracteres: 50
        mensagem_email: string, //O campo pode ser preenchido de forma personalizada. Máximo caracteres: 200
        lista_mensagem_cobranca: [{
            mensagens: string, //Pode ser enviado até 3 mensagens com até 50 caracteres. Caso na requisição seja enviado o e-mail do pagador, adicionaremos as mensagens.
        }],
    },
    pagador: {
        pessoa: {
            nome_pessoa: string, //Nome / Razão social do pagador não devem ter abreviações no primeiro e no último nome.Desse modo, as abreviações deverão ocorrer no nome do meio, limitados a 50 caracteres.
            tipo_pessoa: {
                codigo_tipo_pessoa: string, //Tipo de pessoa do pagador Pessoa Física - 'F' Pessoa Jurídica - 'J'
                numero_cadastro_pessoa_fisica: string, //PF do pagador - Obrigatório caso tipo_pessoa = F com 11 numeros(sem pontos, traços ou barras); não informar o campo caso tipo_pessoa = J.Exemplo: 12345678910
                numero_cadastro_nacional_pessoa_juridica: string, //CNPJ do pagador - Obrigatório caso tipo_pessoa = J com 14 números(sem pontos, traços ou barras); não informar o campo caso tipo_pessoa = F.Exemplo: 12312312000110
            }
        },
        endereco: {
            nome_logradouro: string, //Nome do logradouro, número, complemento.Máximo: 45 caracteres.Se informado deve constar conforme site do Correios.
            nome_bairro: string, //Nome do bairro.Máximo: 15 caracteres.Se informado deve constar conforme site dos Correios.
            nome_cidade: string, //Nome do bairro.Máximo: 20 caracteres.Se informado deve constar conforme site dos Correios.
            sigla_UF: string, //Sigla da UF.Máximo: 02 caracteres.Se informado deve constar conforme site dos Correios.
            numero_CEP: string, //CEP.Formato: 8 números, sem pontos e traços.Se informado deve constar conforme site dos Correios.
        }
    },
    sacador_avalista: {
        pessoa: {
            nome_pessoa: string, //Nome / Razão social do sacador avalista.Máximo de caracteres: 50.
            tipo_pessoa: {

                codigo_tipo_pessoa: string, //Tipo de pessoa do sacador avalista.Pessoa Física - 'F' Pessoa Jurídica - 'J'
                numero_cadastro_pessoa_fisica: string, //CPF do sacador avalista - Obrigatório caso tipo_pessoa = F com 11 números(sem pontos, traços ou barras); não informar o campo caso tipo_pessoa = J.Exemplo: 12345678910
                numero_cadastro_nacional_pessoa_juridica: string, //CNPJ do sacador avalista - Obrigatório caso tipo_pessoa = J com 14 números(sem pontos, traços ou barras); não informar o campo caso tipo_pessoa = F.Exemplo: 12312312000110
            },
        }
        endereco: {
            nome_logradouro: string, //Nome do logradouro, número, complemento.Deve estar igual ao site dos Correios.Obrigatório caso o sacador_avalista tenha sido indicado.Máximo: 45 caracteres *
            nome_bairro: string, //Nome do bairro.Obrigatório caso informe sacador avalista.Deve estar igual ao site dos Correios.Máximo: 15 caracteres *
            nome_cidade: string, //Nome da cidade.Obrigatório caso informe sacador avalista.Deve estar igual ao site dos Correios.Máximo: 20 caracteres *
            sigla_UF: string, //Sigla da UF.Obrigatório caso informe sacador avalista.Deve estar igual ao site dos Correios.Máximo: 2 caracteres *
            numero_CEP: string, //CEP.Obrigatório caso informe sacador avalista.Deve estar igual ao site dos Correios.Formato: 8 números, sem pontos e traços
        }
    }
    dados_individuais_boleto: {
        numero_nosso_numero: string, //Número de identificação do título.De livre utilização do usuário seguindo as regras da carteira do produto contratado.Não pode ser repetido se nosso número ainda estiver ativo ou tiver menos de 45 dias de sua baixa / liquidação.Nosso número é obrigatório para carteira 109. Máximo: 08 caracteres.
        data_vencimento: string, //Data máxima para pagamento do título sem que haja acréscimo de juros e multa.Formato: AAAA - MM - DD
        valor_titulo: string, //Valor a ser cobrado.Formato do campo: 15 dígitos inteiros e 2 casas decimais
        data_limite_pagamento: string, //Data limite para pagamento do título.Após esta data, o título não poderá ser pago.Informar, no mínimo a data de vencimento, e no máximo data futura de 10 anos.Caso não seja informada a data, será assumido como 10 anos.Formato: AAAA - MM - DD.Em breve, caso a data de limite de pagamento informada seja anterior ao vencimento, será atribuída a data de vecimento para esse campo.
        texto_seu_numero: string, //Seu número é a identificação do boleto que poderá ter letras e números e facilitará a consulta e acompanhamento do status do boleto.Este campo é para controle do cliente e obrigatório em caso de serviço de protesto.Máximo: 10 caracteres *
        texto_uso_beneficiario: string, //Campo de 25 caracteres.Deve ser utilizado apenas letras e números.Caso seja preenchido, a informação registrada será devolvida no campo “uso da empresa” do arquivo de retorno CNAB.
    },
    desconto_expresso: boolean, //Indicador de desconto.Enviar como "false"
    juros: {
        codigo_tipo_juros: string, //Tipo da cobrança dos juros no cálculo da cobrança.Para cada um dos valores informados, será impresso no boleto a notação referente ao valor correspondente em porcentagem mensal.
        //'05' Quando não se deseja cobrar juros caso o pagamento seja feito após o vencimento(isento)
        //'90' Percentual mensal(utilizando parâmetros do cadastro de beneficiário para dias úteis ou corridos)
        //'91' - Percentual diário(utilizando parâmetros do cadastro de beneficiário para dias úteis ou corridos)
        //'92' - Percentual anual(utilizando parâmetros do cadastro de beneficiário para dias úteis ou corridos)
        //'93' - Valor diário(utilizando parâmetros do cadastro de beneficiário para dias úteis ou corridos)
        valor_juros: string, //Valor dos juros a ser cobrado.Formato do campo: 15 dígitos inteiros e 2 casas decimais.Exemplo: 99999999999999900. Obrigatório para codigo_tipo_juros ‘93’. Se valor informado ficar inferior à R$ 0,01 ao dia ou acima de 99, 99 % ao mês / 3, 33333 % ao dia / 1.199, 88 % ao ano, o registro do juros será desconsiderado e boleto emitido, sem juros.
        percentual_juros: string, //Valor dos juros a ser cobrado.Formato do campo: 7 dígitos inteiros e 5 casas decimais.Exemplo: 999999900000. Obrigatório para codigo_tipo_juros ‘90’, ‘91’ e ‘92’. Se valor informado ficar inferior à R$ 0,01 ao dia ou acima de 99, 99 % ao mês / 3, 33333 % ao dia / 1.199, 88 % ao ano, o registro do juros será desconsiderado e boleto emitido, sem juros.
        data_juros: string, //Data de início de cobrança de juros, deve ser posterior ao vencimento.Caso o campo esteja vazio, será automaticamente assumido que a cobrança de juros se inicia logo após o vencimento.Formato: AAAA - MM - DD.Em breve, quando informada uma data anterior ao vencimento, será atribuída a data de vencimento ao parâmetro.
    },
    multa: {
        codigo_tipo_multa: string, //Código da multa '01' - Quando se deseja cobrar um valor fixo de multa após o vencimento. '02' - Quando se deseja cobrar um percentual do valor do título de multa após o vencimento. '03' - Quando não se deseja cobrar multa caso o pagamento seja feito após o vencimento(isento)
        valor_multa: string, //Valor da multa a ser cobrada.Formato do campo: 15 dígitos inteiros e 2 casas decimais.Exemplo: 99999999999999900. Obrigatório para codigo_tipo_multa 01.Se valor informado ficar inferior à R$ 0,01 ao dia ou acima de 99, 99 % ao mês, o registro da multa será desconsiderado e boleto emitido, sem multa.
        percentual_multa: string, //Valor dos multa a ser cobrado.Formato do campo: 7 dígitos inteiros e 5 casas decimais.Exemplo: 999999900000. Obrigatório para codigo_tipo_multa 02.Se valor informado ficar inferior à R$ 0,01 ao dia ou acima de 99, 99 % ao mês, o registro da multa será desconsiderado e boleto
        data_multa: string, //Data de início de cobrança de multa, deve ser posterior ao vencimento.Caso o campo esteja vazio, será automaticamente assumido que a cobrança de multa se inicia logo após o vencimento.Formato: AAAA - MM - DD.Em breve, quando informada uma data anterior ao vencimento, será atribuída a data de vencimento ao parâmetro.
    }
    desconto: {
        codigo_tipo_desconto: string, //Código do desconto.Caso exista mais de um desconto, todos os tipo_desconto deverão ter o mesmo código. '00' - Quando não houver condição de desconto(sem desconto). '01' - Quando o desconto for um valor fixo se o título for pago até a data informada(data_desconto). '02' - Quando o desconto for um percentual(mensal) do valor do título e for pago até a data informada(data_desconto). '90' - Percentual por antecipação(utilizando parâmetros do cadastro de beneficiário para dias úteis ou corridos).'91' - Valor por antecipação(utilizando parâmetros do cadastro de beneficiário para dias úteis ou corridos).
        data_desconto: string, //Data limite de cobrança de desconto, deve ser anterior ou igual ao vencimento.Caso o campo esteja vazio, será automaticamente assumido que a cobrança de desconto é até a data de vencimento.Formato: AAAA - MM - DD.Obrigatório quando codigo_tipo_desconto é informado e deve ser inserido em ordem decrescente.Em breve, quando informada uma data posterior ao vencimento, será atribuída a data de vencimento ao parâmetro.
        valor_desconto: string, //Valor do desconto a ser cobrado.Obrigatório para codigo_tipo_desconto 1 ou 91. Valor calculado deve ser superior a R$0,01.Formato do campo: 15 dígitos inteiros e 2 casas decimais.Obrigatório quando codigo_tipo_desconto é informado.Quando o valor informado for inferior à R$ 0,01 ao dia o parâmetro será ignorado e o boleto emitido, sem desconto.
        percentual_desconto: string, //Percentual do desconto concedido.Obrigatório para codigo_tipo_desconto 2 ou 90. Valor calculado deve ser superior a R$0,01.Formato do campo: 7 dígitos inteiros e 5 casas decimais.Obrigatório quando codigo_tipo_desconto é informado.Quando o valor calculado for inferior à R$ 0,01 ao dia o parâmetro será ignorado e o boleto emitido, sem desconto.
    },
    recebimento_divergente: {
        codigo_tipo_autorizacao: string, //Tipo de autorização de recebimento divergente da cobrança. "01" - Quando o título aceita qualquer valor divergente ao da cobrança. "02" - Quando o título contém uma faixa de valores aceitos para recebimentos divergentes. "03" - Quando o título não deve aceitar pagamentos de valores divergentes ao da cobrança. "04" - Quando o título aceitar pagamentos de valores superiores ao mínimo definido"
        codigo_tipo_recebimento: string, //Tipo de autorização de recebimento divergente da cobrança.Obrigatório para codigo_tipo_autorizacao diferente de 01 e 03.V - Recebimento divergente for informado por valores P - Recebimento divergente for informado por percentuais
        valor_minimo: string, //Valor mínimo permitido para pagamento.Obrigatório para codigo_aceite_pagamento_divergente 2 ou 4. Formato do campo: 15 dígitos inteiros e 2 casas decimais
        percentual_minimo: string, //Percentual mínimo permitido para pagamento.Obrigatório para codigo_tipo_autorizacao 2 ou 4. Formato do campo: 7 dígitos inteiros e 5 casas decimais
        valor_maximo: string, //Valor máximo permitido para pagamento.Obrigatório para codigo_tipo_autorizacao 2. Formato do campo: 15 dígitos inteiros e 2 casas decimais
        percentual_maximo: string, //Percentual máximo permitido.Obrigatório para codigo_tipo_autorizacao 2. Formato do campo: 7 dígitos inteiros e 5 casas decimais
    },
    protesto: {
        protesto: boolean, //Para solicitar o registro da instrução de 'protesto', informar "true".Para solicitar o registro da instrução de 'não protestar', informar "false".Se não tiver interesse em registrar nenhuma instrução relativa a protesto, não enviar o bloco de protesto.
        quantidade_dias_protesto: number, //Em caso de protesto "true"(campo acima) enviar a quantidade de dias, mínimo 1 e máximo 99. Em caso de protesto "false" não enviar quantidade de dias OU enviar valor zero.
    },
    negativacao: {
        negativacao: boolean, //Em caso de negativação informar "true".Em caso de não negativar não enviar o bloco de negativação.
        quantidade_dias_negativacao: number, //Em caso de negativação "true"(campo acima) enviar a quantidade de dias, mínimo 2 e máximo 99. Em caso de negativação "false" não enviar o campo.
    },
    instrucao_cobranca: [{
        codigo_instrucao_cobranca: string, //Códigos das instruções de protesto.Podem ser enviadas até 4 instruções de Recebimentos e até 3 instruções de Cobrança, ou seja, até 7 instruções por boleto.Se houverem mais comandos, iremos descartar um instrução aleatoriamente.Ver "Tabela de Instruções de Recebimentos" e "Tabela de Instruções de Cobrança".
        quantidade_dias_apos_vencimento: number, //Quantidade de dias após vencimento do boleto, o prazo deve ser entre 01 e 99 dias.Para baixa também é possível 365 dias de vencido.
        dia_util: boolean, //Caso a quantidade de dias após o vencimento tenha que ser contabilizada em dia útil, informar true.Caso tenha que ser contabilizada em dias corridos, informar false.Importante as orientações mencionadas, não são validas para as instruções 7 - “Não receber após XX de vencimento” e 8 – “Cancelar(Baixar / Devolver) após XX de vencimento, o prazo deve ser entre 01 e 99 dias, ou 365 dias de vencido.” Atenção: O CEP do pagador e sacador avalista(se houver) precisa estar correto conforme site dos Correios.Caso não informado será atribuído false / corridos.}
    }]
}

interface registroRetorno {
    id_boleto: string,
    etapa_processo_boleto: string, //Emissão - 'efetivacao' (usado para ambinte produtivo) Simulação de Emissão - 'validacao' (usado para testes)
    codigo_canal_operacao: string,  //API
    beneficiario: {
        id_beneficiario: string, //Agência (4 dígitos) + Conta (7 dígitos) + DAC (1 dígito). Exemplo: 150000123450
        nome_cobranca: string,  //Razão social do beneficiário. Máximo caracteres: 50.
        tipo_pessoa: {
            codigo_tipo_pessoa: string,  //Tipo pessoa do beneficiario Pessoa Física - 'F' Pessoa Jurídica - 'J'
            numero_cadastro_pessoa_fisica: string,  //CPF do beneficiario - Obrigatório caso tipo_pessoa = F Exemplo: 12345678910
            numero_cadastro_nacional_pessoa_juridica: string,  //CNPJ do beneficiario - Obrigatório caso tipo_pessoa = J Exemplo: 12312312000110`
        }
    },
    dados_boleto: {
        forma_envio: string,  //'impressão' 'e-mail'
        codigo_tipo_vencimento: number, //Tipo de vencimento do boleto. '3' - Data de vencimento informada pelo cliente
    },
    pagador: {
        pagador_eletronico_DDA: boolean, //Indica se o pagador possui cadastro no DDA
        praca_protesto: boolean //Indica se o CEP do pagador é de uma praça protestável
    },
    dados_individuais_boleto: {
        id_boleto_individual: string,  //Identificador do título
        codigo_barras: string,  //Número do código de barras
        numero_linha_digitavel: string,  //Número da linha digitável
        texto_uso_beneficiario: string,  //Campo de 25 caractéres, utilizado na API legado como "identificador_titulo_empresa". Deve ser utilizado apenas letras e números.
    },
    juros: {
        codigo_tipo_juros: string,  //O retorno será de acordo com o parâmetros do cadastro de beneficiário para dias úteis ou corridos.
    },
    //Isento - '05' para dias úteis e '05' para dias corridos.
    //Percentual mensal - '08' para dias úteis e '03' para dias corridos.
    //Percentual diário - '07' para dias úteis e '02' para dias corridos.
    //Percentual anual- '09' para dias úteis e '04' para dias corridos.
    //Valor diário - '06' para dias úteis e '01' para dias corridos.
}