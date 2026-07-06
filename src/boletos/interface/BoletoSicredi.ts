interface BoletoSicredi {
    tipoCobranca: string, //Tipo de cobranca HÍBRIDO (PIX)/ NORMAL
    codigoBeneficiario: string, //Convenio bancário
    especieDocumento: string, //Espécie de documento
    nossoNumero: string, //Opcional. Caso o beneficiário não informe, o Sicredi gera automaticamente. 
    seuNumero: string, //Número de controle interno do beneficiário que faz referência ao pagador.
    idTituloEmpresa: string, //Id de controle do beneficiário. Semelhante ao “seuNumero” que permite mais caracteres. 
    dataVencimento: string, //Data de vencimento do boleto YYYY-MM-DD
    diasProtestoAuto: number, //Quantidade de dias, após o vencimento, em que será realizado o protesto automático do boleto 
    diasNegativacaoAuto: number, //Quantidade de dias, após o vencimento, em que o boleto será negativado automaticamente
    validadeAposVencimento: number, //Quantidade de dias que o QR Code continuará válido após o vencimento, caso seja um boleto híbrido. 
    valor: number, //Valor do boleto
    tipoDesconto: string, //Tipo de desconto podendo ser:  VALOR ou PERCENTUAL
    valorDesconto1: number, //Valor de desconto 1  Opcional. Será obrigatório se o campo dataDesconto1 for informado. 
    // Não deverá ser informado caso o desconto antecipado esteja preenchido 
    dataDesconto1: string, //Data limite para concessão de desconto1   YYYY-MM-DD
    valorDesconto2: number, //Valor de desconto 2  Opcional. Será obrigatório se o campo dataDesconto2 for informado. 
    // Não deverá ser informado caso o desconto antecipado esteja preenchido 
    dataDesconto2: string, //Data limite para concessão de desconto2   YYYY-MM-DD
    valorDesconto3: number, //Valor de desconto 3  Opcional. Será obrigatório se o campo dataDesconto3 for informado. 
    // Não deverá ser informado caso o desconto antecipado esteja preenchido 
    dataDesconto3: string, //Data limite para concessão de desconto3   YYYY-MM-DD
    tipoJuros: string, //Tipo de Juros, podendo ser: VALOR DIARIA - VALOR MENSL- PERCENTUAL DIARIO - PERCENTUAL MENSAL - SEM JUROS
    tipoJurosPercentual: string, //Tipo de Juros percentual, DIARIA - MENSAL
    juros: number, //Valor de juros a cobrar por dia  ou o percentual
    dataInicioJuros: string, //Data para inicio da cobrança de juros após o vencimetno.
    tipoMulta: string, //Tipo de Multa, podendo ser: VALOR - PERCENTUAL
    multa: number, //Valor da multa a ser cobrada
    dataInicioMulta: string, //Data para inicio da cobrança da multa após o vencimetno.
    informativos: string[],
    mensagem: string[],
    pagador: {
        tipoPessoa: string, //Tipo de pessoa do Pagador Ex.:? (PESSOA_JURIDICA ou PESSOA_FISICA)
        documento: string, //CPF ou CNPJ do Pagador do boleto
        nome: string, //Nome do Pagador  (Caso o nome ultrapasse 40 caracteres, haverá uma abreviação a partir do caractere 40.)
        endereco: string, // Endereço do Pagador
        cidade: string, //Cidade do pagador
        uf: string, //UF do pagador
        cep: string; //CEP do Pagador
        telefone: string, //Telefone do Pagador
        email: string, //Email do Pagador
    },
    beneficiarioFinal: {
        tipoPessoa: string, //Tipo de pessoa do Benefciário final Ex.:? (PESSOA_JURIDICA ou PESSOA_FISICA)
        documento: string, //CPF ou CNPJ do Benefciário final do boleto
        nome: string, //Nome do Benefciário final  (Caso o nome ultrapasse 40 caracteres, haverá uma abreviação a partir do caractere 40.)
        logreadouro: string, // Logradouro do Benefciário final
        numeroEndereco: string,// Número do Endereço do Benefciário final
        cidade: string, //Cidade do Benefciário final
        uf: string, //UF do Benefciário final
        cep: string, //CEP do Benefciário final
        telefone: string, //Telefone do Benefciário final
        email: string, //Email do Benefciário final
    }
}

