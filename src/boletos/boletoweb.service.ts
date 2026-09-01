import { PrismaService } from '@/prisma/prisma.service';
import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from '@nestjs/common';
import { BoletoStatus } from '@prisma/client';
import { isAxiosError } from 'axios';
import * as fs from 'fs';

@Injectable()
export class BoletoWebService {
    constructor(private readonly httpService: HttpService,
        private prismaService: PrismaService,
    ) { }

    /**Registro boleto Itaú */
    async RegistraBoleto341(boletobancarioId: number) {

        //Cria boleto bancário para envio
        /*
        const boletoBancario = await this.PrismaService.boletoBancario.create({
            data: {
                boleto: boleto.boletoId ? { connect: { id: boleto.boletoId } } : undefined,
                valor: boleto.valor, //Valor do boleto
                valorPago: boleto.valorPago, //Valor pago no boleto
                dataBoleto: boleto.dataBoleto, //Emissao do boleto
                dataVencimento: boleto.dataVencimento, //Vencimento do boleto
                dataPagamento: boleto.dataPagamento, //Data de pagamento do boleto
                formaPix: boleto.formaPix, //Forma de pagamento PIX para recebimento
                codigoBarras: boleto.codigoBarras,
                linhaDigitavel: boleto.linhaDigitavel,
                nossoNumero: boleto.nossoNumero,
                urlBoleto: boleto.urlBoleto, //URL para visualização do boleto
                registrado: boleto.registrado, //S/N Informa se ocorreu o registro do boleto
                emvPIX: boleto.emvPIX, //Código EMV para pagamento via PIX
                metodoPagamento: boleto.metodoPagamento, //Método de pagamento utilizado
                status: boleto.status, //Status do boleto
                observacao: boleto.observacao,

                pagtoParcial: boleto.pagtoParcial, //Indica se o alerta está ativo ou não
                qtdeMaxParcial: boleto.qtdeMaxParcial, //Quantide de pagamentos parcial 1..99
                formaEnvio: boleto.formaEnvio,
                email: boleto.email,
                assuntoEmail: boleto.assuntoEmail,
                mensagemEmail1: boleto.mensagemEmail1,
                mensagemEmail2: boleto.mensagemEmail2,
                mensagemEmail3: boleto.mensagemEmail3,

                tipoJurosCobCod: boleto.tipoJurosCobCod,
                valorJuros: boleto.valorJuros,
                percJuros: boleto.percJuros,
                diasInicioJuros: boleto.diasInicioJuros,

                tipoMultaCobCod: boleto.tipoMultaCobCod,
                valorMulta: boleto.valorMulta,
                percMulta: boleto.percMulta,
                diasInicioMulta: boleto.diasInicioMulta,

                tipoDescontoCobCod: boleto.tipoDescontoCobCod,
                valorDesconto: boleto.valorDesconto,
                percDesconto: boleto.percDesconto,
                diasInicioDesconto: boleto.diasInicioDesconto,

                tipoAutorizacaoCobCod: boleto.tipoAutorizacaoCobCod,
                tipoRecebimentoDiv: boleto.tipoRecebimentoDiv,
                valorMinDiverg: boleto.valorMinDiverg,
                valorMaxDiverg: boleto.valorMaxDiverg,
                percMinDiverg: boleto.percMinDiverg,
                percMaxDiverg: boleto.percMaxDiverg,

                protestar: boleto.protestar,
                qtdeDiasProtesto: boleto.qtdeDiasProtesto,
                negativar: boleto.negativar,
                qtdeDiasNegativar: boleto.qtdeDiasNegativar,

                instrucaoCobCod1: boleto.instrucaoCobCod1,
                instrucaoCobCod2: boleto.instrucaoCobCod2,
                instrucaoCobCod3: boleto.instrucaoCobCod3,

                instrucaoRecCod1: boleto.instrucaoRecCod1,
                instrucaoRecCod2: boleto.instrucaoRecCod2,
                instrucaoRecCod3: boleto.instrucaoRecCod3,
                instrucaoRecCod4: boleto.instrucaoRecCod4,

                carteiraCod: boleto.carteiraCod,
                especieCod: boleto.especieCod,

                contacorrente: boleto.contaId ? { connect: { id: boleto.contaId } } : undefined,
            },
            include: {
                boleto: {
                    include: {
                        imovel: {
                            include: {
                                proprietarios: {
                                    include: {
                                        pessoa: {
                                            include: {
                                                endereco: true,
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        locacao: {
                            include: {
                                locatarios: {
                                    include: {
                                        pessoa: {
                                            include: {
                                                endereco: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        empresa: {
                            include: {
                                endereco: true,
                            }
                        },
                        contaCorrente: true,
                    }
                },
            },
        });*/

        const boletoBancario = await this.prismaService.boletoBancario.findUnique({
            where: {
                id: boletobancarioId
            },
            include: {
                boleto: {
                    include: {
                        imovel: {
                            include: {
                                proprietarios: {
                                    include: {
                                        pessoa: {
                                            include: {
                                                endereco: true,
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        locacao: {
                            include: {
                                locatarios: {
                                    include: {
                                        pessoa: {
                                            include: {
                                                endereco: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        empresa: {
                            include: {
                                endereco: true,
                            }
                        },
                        contaCorrente: true,
                    }
                },
            },
        });

        let envioJSON: BoletoItau = {
            etapa_processo_boleto: 'validacao',
            codigo_canal_operacao: 'API', ///Código do canal de operação 'API'
            beneficiario: {
                id_beneficiario: boletoBancario.boleto.contaCorrente.agencia.padStart(4, '0') +
                    boletoBancario.boleto.contaCorrente.conta.padStart(7, '0') +
                    boletoBancario.boleto.contaCorrente.digito,
            },
            dado_boleto: {
                descricao_instrumento_cobranca: 'boleto',
                tipo_boleto: 'a vista',
                codigo_carteira: boletoBancario.carteiraCod,
                codigo_especie: boletoBancario.especieCod,
                valor_abatimento: '000',
                data_emissao: boletoBancario.dataBoleto.toISOString().split('T')[0],
                pagamento_parcial: boletoBancario.pagtoParcial,
                quantidade_maximo_parcial: boletoBancario.qtdeMaxParcial,
                forma_envio: boletoBancario.formaEnvio,
                pagador: {
                    texto_endereço_email: boletoBancario.formaEnvio === 'email' ? boletoBancario.email : '',
                },
                assunto_email: boletoBancario.formaEnvio === 'email' ? boletoBancario.email : '',
                mensagem_email: boletoBancario.formaEnvio === 'email' ? boletoBancario.assuntoEmail : '',
                lista_mensagem_cobranca: [
                    { mensagens: boletoBancario.mensagemEmail1 }
                ],
            },
            pagador: {
                pessoa: {
                    nome_pessoa: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.nome :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.nome),
                    tipo_pessoa: {
                        codigo_tipo_pessoa: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                            (boletoBancario.boleto.locacao.locatarios[0].pessoa.documento.length > 11 ? 'J' : 'F') :
                            (boletoBancario.boleto.imovel.proprietarios[0].pessoa.documento.length > 11 ? 'J' : 'F')
                        ),
                        numero_cadastro_pessoa_fisica: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                            (boletoBancario.boleto.locacao.locatarios[0].pessoa.documento.length > 11 ? '' : boletoBancario.boleto.locacao.locatarios[0].pessoa.documento.padStart(11, '0')) :
                            (boletoBancario.boleto.imovel.proprietarios[0].pessoa.documento.length > 11 ? '' : boletoBancario.boleto.imovel.proprietarios[0].pessoa.documento.padStart(11, '0'))
                        ),
                        numero_cadastro_nacional_pessoa_juridica: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                            (boletoBancario.boleto.locacao.locatarios[0].pessoa.documento.length > 11 ? boletoBancario.boleto.locacao.locatarios[0].pessoa.documento.padStart(14, '0') : '') :
                            (boletoBancario.boleto.imovel.proprietarios[0].pessoa.documento.length > 11 ? boletoBancario.boleto.imovel.proprietarios[0].pessoa.documento.padStart(14, '0') : '')
                        ),
                    }
                },
                endereco: {
                    nome_logradouro: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.logradouro :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.logradouro),
                    nome_bairro: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.bairro :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.bairro),
                    nome_cidade: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.cidade :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.cidade),
                    sigla_UF: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.estado :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.estado),
                    numero_CEP: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.cep :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.cep),
                }
            },
            sacador_avalista: {
                pessoa: {
                    nome_pessoa: boletoBancario.boleto.empresa.nome,
                    tipo_pessoa: {

                        codigo_tipo_pessoa: boletoBancario.boleto.empresa.cnpj.length > 11 ? 'J' : 'F',
                        numero_cadastro_pessoa_fisica: boletoBancario.boleto.empresa.cnpj.length > 11 ? '' : boletoBancario.boleto.empresa.cnpj,
                        numero_cadastro_nacional_pessoa_juridica: boletoBancario.boleto.empresa.cnpj.length > 11 ? boletoBancario.boleto.empresa.cnpj : '',
                    },
                },
                endereco: {
                    nome_logradouro: boletoBancario.boleto.empresa.endereco.logradouro,
                    nome_bairro: boletoBancario.boleto.empresa.endereco.bairro,
                    nome_cidade: boletoBancario.boleto.empresa.endereco.cidade,
                    sigla_UF: boletoBancario.boleto.empresa.endereco.estado,
                    numero_CEP: boletoBancario.boleto.empresa.endereco.cep,
                }
            },
            dados_individuais_boleto: {
                numero_nosso_numero: boletoBancario.id.toString() + ';' + boletoBancario.boletoId.toString(),
                data_vencimento: boletoBancario.dataVencimento.toISOString().split('T')[0],
                valor_titulo: boletoBancario.valor.toFixed(2).padStart(15, '0'),
                data_limite_pagamento: boletoBancario.dataPagamento.toISOString().split('T')[0],
                texto_seu_numero: boletoBancario.id.toString() + ';' + boletoBancario.boletoId.toString(),
                texto_uso_beneficiario: boletoBancario.id.toString() + ';' + boletoBancario.boletoId.toString(),
            },
            desconto_expresso: false,
            juros: {
                codigo_tipo_juros: boletoBancario.tipoJurosCobCod,
                valor_juros: boletoBancario.valorJuros ? boletoBancario.valorJuros.toFixed(2).padStart(15, '0') : '0',
                percentual_juros: boletoBancario.percJuros ? boletoBancario.percJuros.toFixed(2).padStart(12, '0') : '0',
                data_juros: boletoBancario.dataVencimento ? addDays(boletoBancario.dataVencimento, boletoBancario.diasInicioJuros).toISOString().split('T')[0] : null,
            },
            multa: {
                codigo_tipo_multa: boletoBancario.tipoMultaCobCod,
                valor_multa: boletoBancario.valorMulta ? boletoBancario.valorMulta.toFixed(2).padStart(15, '0') : '0',
                percentual_multa: boletoBancario.percMulta ? boletoBancario.percMulta.toFixed(2).padStart(12, '0') : '0',
                data_multa: boletoBancario.dataVencimento ? addDays(boletoBancario.dataVencimento, boletoBancario.diasInicioMulta).toISOString().split('T')[0] : null,
            },
            desconto: {
                codigo_tipo_desconto: boletoBancario.tipoDescontoCobCod,
                data_desconto: boletoBancario.valorDesconto ? boletoBancario.valorDesconto.toFixed(2).padStart(15, '0') : '0',
                valor_desconto: boletoBancario.percDesconto ? boletoBancario.percDesconto.toFixed(2).padStart(12, '0') : '0',
                percentual_desconto: boletoBancario.dataVencimento ? addDays(boletoBancario.dataVencimento, boletoBancario.diasInicioDesconto).toISOString().split('T')[0] : null,
            },
            recebimento_divergente: {
                codigo_tipo_autorizacao: boletoBancario.tipoAutorizacaoCobCod,
                codigo_tipo_recebimento: boletoBancario.tipoRecebimentoDiv,
                valor_minimo: boletoBancario.valorMinDiverg ? boletoBancario.valorMinDiverg.toFixed(2).padStart(15, '0') : '0',
                percentual_minimo: boletoBancario.percMinDiverg ? boletoBancario.percMinDiverg.toFixed(2).padStart(15, '0') : '0',
                valor_maximo: boletoBancario.valorMaxDiverg ? boletoBancario.valorMaxDiverg.toFixed(2).padStart(15, '0') : '0',
                percentual_maximo: boletoBancario.percMinDiverg ? boletoBancario.percMinDiverg.toFixed(2).padStart(15, '0') : '0',
            },
            protesto: {
                protesto: boletoBancario.protestar,
                quantidade_dias_protesto: boletoBancario.qtdeDiasProtesto,
            },
            negativacao: {
                negativacao: boletoBancario.negativar,
                quantidade_dias_negativacao: boletoBancario.qtdeDiasNegativar,
            },
            instrucao_cobranca: [{
                codigo_instrucao_cobranca: boletoBancario.instrucaoCobCod1,
                quantidade_dias_apos_vencimento: boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto,
                dia_util: boletoBancario.boleto.contaCorrente.cobrancaDiaUtil,
            }]
        };

        if (boletoBancario.mensagemEmail2 && boletoBancario.mensagemEmail2.length > 0) {
            envioJSON.dado_boleto.lista_mensagem_cobranca.concat({ mensagens: boletoBancario.mensagemEmail2 });
        }
        if (boletoBancario.mensagemEmail3 && boletoBancario.mensagemEmail3.length > 0) {
            envioJSON.dado_boleto.lista_mensagem_cobranca.concat({ mensagens: boletoBancario.mensagemEmail3 });
        }

        if (boletoBancario.instrucaoCobCod2 && boletoBancario.instrucaoCobCod2.length > 0) {
            envioJSON.instrucao_cobranca.concat({
                codigo_instrucao_cobranca: boletoBancario.instrucaoCobCod2,
                quantidade_dias_apos_vencimento: boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto,
                dia_util: boletoBancario.boleto.contaCorrente.cobrancaDiaUtil,
            })
        }
        if (boletoBancario.instrucaoCobCod3 && boletoBancario.instrucaoCobCod3.length > 0) {
            envioJSON.instrucao_cobranca.concat({
                codigo_instrucao_cobranca: boletoBancario.instrucaoCobCod3,
                quantidade_dias_apos_vencimento: boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto,
                dia_util: boletoBancario.boleto.contaCorrente.cobrancaDiaUtil,
            })
        }

        if (boletoBancario.instrucaoRecCod2 && boletoBancario.instrucaoRecCod2.length > 0) {
            envioJSON.instrucao_cobranca.concat({
                codigo_instrucao_cobranca: boletoBancario.instrucaoRecCod2,
                quantidade_dias_apos_vencimento: boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto,
                dia_util: boletoBancario.boleto.contaCorrente.cobrancaDiaUtil,
            })
        }
        if (boletoBancario.instrucaoRecCod3 && boletoBancario.instrucaoRecCod3.length > 0) {
            envioJSON.instrucao_cobranca.concat({
                codigo_instrucao_cobranca: boletoBancario.instrucaoRecCod3,
                quantidade_dias_apos_vencimento: boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto,
                dia_util: boletoBancario.boleto.contaCorrente.cobrancaDiaUtil,
            })
        }
        if (boletoBancario.instrucaoRecCod4 && boletoBancario.instrucaoRecCod4.length > 0) {
            envioJSON.instrucao_cobranca.concat({
                codigo_instrucao_cobranca: boletoBancario.instrucaoRecCod4,
                quantidade_dias_apos_vencimento: boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto,
                dia_util: boletoBancario.boleto.contaCorrente.cobrancaDiaUtil,
            })
        }

        const responseOrder = await this.httpService.axiosRef.post('https://sandbox.devportal.itau.com.br/itau-ep9-gtw-cash-management-ext-v2/v2', envioJSON, {
            //const responseOrder = await this.httpService.axiosRef.post('https://devportal.itau.com.br/sandboxapi/cash_management_ext_v2/v2', envioJSON, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                //'Access-Control-Allow-Origin': '*',
                'x-itau-apikey': 'eaa086d6-7fb3-35a7-b87e-831d12203796',
                'x-itau-correlationID': 'BoletosAdmImovelManual',
                'x-itau-flowID': 'BoletosAdmImovelManual',
                'x-sandbox-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYWEwODZkNi03ZmIzLTM1YTctYjg3ZS04MzFkMTIyMDM3OTYiLCJleHAiOjE3ODIyNDQyNjcsImlhdCI6MTc4MjI0Mzk2Nywic291cmNlIjoic3RzLXNhbmRib3giLCJlbnYiOiJQIiwiZmxvdyI6IkNDIiwic2NvcGUiOiJwaXhfcmVjZWJpbWVudG9zX2V4dF92Mi1zY29wZSIsInVzZXJuYW1lIjoiamFja3NvbkBuYXRpdmlkYWRlc29sdWNvZXMuY29tLmJyIiwib3JnYW5pemF0aW9uTmFtZSI6IlJBTUlSTyBDQU1QRUxPIENPTSBERSBVVElMIExURCJ9.ksykVIl9mF8vLir5HZ1e3tuwWAGdiY4W3MuP2mOLbSI',
                'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYWEwODZkNi03ZmIzLTM1YTctYjg3ZS04MzFkMTIyMDM3OTYiLCJleHAiOjE3ODIyNDQyNjcsImlhdCI6MTc4MjI0Mzk2Nywic291cmNlIjoic3RzLXNhbmRib3giLCJlbnYiOiJQIiwiZmxvdyI6IkNDIiwic2NvcGUiOiJwaXhfcmVjZWJpbWVudG9zX2V4dF92Mi1zY29wZSIsInVzZXJuYW1lIjoiamFja3NvbkBuYXRpdmlkYWRlc29sdWNvZXMuY29tLmJyIiwib3JnYW5pemF0aW9uTmFtZSI6IlJBTUlSTyBDQU1QRUxPIENPTSBERSBVVElMIExURCJ9.ksykVIl9mF8vLir5HZ1e3tuwWAGdiY4W3MuP2mOLbSI`
            }
        });

        console.log("JSON: ", responseOrder);

    }

    /**Registro boleto Banco Sicredi */
    async RegistraBoleto748(boletobancarioId: number) {

        let str_pos = '';
        try {
            str_pos = 'inicio';
            const boletoBancario = await this.prismaService.boletoBancario.findUnique({
                where: {
                    id: boletobancarioId
                },
                include: {
                    boleto: {
                        include: {
                            imovel: {
                                include: {
                                    proprietarios: {
                                        include: {
                                            pessoa: {
                                                include: {
                                                    endereco: true,
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            locacao: {
                                include: {
                                    locatarios: {
                                        include: {
                                            pessoa: {
                                                include: {
                                                    endereco: true
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            empresa: {
                                include: {
                                    endereco: true,
                                }
                            },
                            contaCorrente: {
                                include: {
                                    instrucaoCob1: true,
                                    instrucaoCob2: true,
                                    instrucaoCob3: true,
                                    instrucaoRec1: true,
                                    instrucaoRec2: true,
                                    instrucaoRec3: true,
                                    instrucaoRec4: true,
                                }
                            },
                        }
                    },
                },
            });

            //Prepara instruções de cobrancas
            let str_instrucaoCob1: string = boletoBancario.boleto.contaCorrente.instrucaoCob1 ? boletoBancario.boleto.contaCorrente.instrucaoCob1.descricao : '';
            let str_instrucaoCob3: string = boletoBancario.boleto.contaCorrente.instrucaoCob2 ? boletoBancario.boleto.contaCorrente.instrucaoCob2.descricao : '';
            let str_instrucaoCob2: string = boletoBancario.boleto.contaCorrente.instrucaoCob3 ? boletoBancario.boleto.contaCorrente.instrucaoCob3.descricao : '';
            let str_instrucaoRec1: string = boletoBancario.boleto.contaCorrente.instrucaoRec1 ? boletoBancario.boleto.contaCorrente.instrucaoRec1.descricao : '';
            let str_instrucaoRec2: string = boletoBancario.boleto.contaCorrente.instrucaoRec2 ? boletoBancario.boleto.contaCorrente.instrucaoRec2.descricao : '';
            let str_instrucaoRec3: string = boletoBancario.boleto.contaCorrente.instrucaoRec3 ? boletoBancario.boleto.contaCorrente.instrucaoRec3.descricao : '';
            let str_instrucaoRec4: string = boletoBancario.boleto.contaCorrente.instrucaoRec4 ? boletoBancario.boleto.contaCorrente.instrucaoRec4.descricao : '';

            let int_pos: number = 0;
            let int_tam: number = 0;
            let str_campo: string = "";

            if (str_instrucaoCob1.length > 0) {
                while (str_instrucaoCob1.indexOf('<', int_pos) > -1) {
                    int_pos = str_instrucaoCob1.indexOf('<', int_pos);
                    int_tam = str_instrucaoCob1.indexOf('>', int_pos);
                    str_campo = str_instrucaoCob1.substring(int_pos, int_tam + 1);

                    switch (str_campo) {
                        case "<mes>":
                            str_instrucaoCob1 = str_instrucaoCob1.replace(str_campo, boletoBancario.dataVencimento.toLocaleDateString('pt-BR', { month: 'long' }));
                            break;

                        case '<ano>':
                            str_instrucaoCob1 = str_instrucaoCob1.replace(str_campo, boletoBancario.dataVencimento.getFullYear().toString());
                            break;

                        case '<diasvencimento>':
                            str_instrucaoCob1 = str_instrucaoCob1.replace(str_campo, boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto.toString());
                            break;

                        case '<multaperc>':
                            str_instrucaoCob1 = str_instrucaoCob1.replace(str_campo, boletoBancario.boleto.contaCorrente.percMulta.toString());
                            break;
                    }

                    int_pos++;
                }
            }
            console.log("str_instrucaoCob1: ", str_instrucaoCob1);

            int_pos = 0;
            int_tam = 0;
            str_campo = "";
            if (str_instrucaoCob2.length > 0) {
                while (str_instrucaoCob2.indexOf('<', int_pos) > -1) {
                    int_pos = str_instrucaoCob2.indexOf('<', int_pos);
                    int_tam = str_instrucaoCob2.indexOf('>', int_pos);
                    str_campo = str_instrucaoCob2.substring(int_pos, int_tam + 1);

                    switch (str_campo) {
                        case "<mes>":
                            str_instrucaoCob2 = str_instrucaoCob2.replace(str_campo, boletoBancario.dataVencimento.toLocaleDateString('pt-BR', { month: 'long' }));
                            break;

                        case '<ano>':
                            str_instrucaoCob2 = str_instrucaoCob2.replace(str_campo, boletoBancario.dataVencimento.getFullYear().toString());
                            break;

                        case '<diasvencimento>':
                            str_instrucaoCob2 = str_instrucaoCob2.replace(str_campo, boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto.toString());
                            break;

                        case '<multaperc>':
                            str_instrucaoCob2 = str_instrucaoCob2.replace(str_campo, boletoBancario.boleto.contaCorrente.percMulta.toString());
                            break;
                    }

                    int_pos++;
                }
            }
            console.log("str_instrucaoCob2: ", str_instrucaoCob2);

            int_pos = 0;
            int_tam = 0;
            str_campo = "";
            if (str_instrucaoCob3.length > 0) {
                while (str_instrucaoCob3.indexOf('<', int_pos) > -1) {
                    int_pos = str_instrucaoCob3.indexOf('<', int_pos);
                    int_tam = str_instrucaoCob3.indexOf('>', int_pos);
                    str_campo = str_instrucaoCob3.substring(int_pos, int_tam + 1);

                    switch (str_campo) {
                        case "<mes>":
                            str_instrucaoCob3 = str_instrucaoCob3.replace(str_campo, boletoBancario.dataVencimento.toLocaleDateString('pt-BR', { month: 'long' }));
                            break;

                        case '<ano>':
                            str_instrucaoCob3 = str_instrucaoCob3.replace(str_campo, boletoBancario.dataVencimento.getFullYear().toString());
                            break;

                        case '<diasvencimento>':
                            str_instrucaoCob3 = str_instrucaoCob3.replace(str_campo, boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto.toString());
                            break;

                        case '<multaperc>':
                            str_instrucaoCob3 = str_instrucaoCob3.replace(str_campo, boletoBancario.boleto.contaCorrente.percMulta.toString());
                            break;
                    }

                    int_pos++;
                }
            }
            console.log("str_instrucaoCob3: ", str_instrucaoCob3);


            int_pos = 0;
            int_tam = 0;
            str_campo = "";

            if (str_instrucaoRec1.length > 0) {
                while (str_instrucaoRec1.indexOf('<', int_pos) > -1) {
                    int_pos = str_instrucaoRec1.indexOf('<', int_pos);
                    int_tam = str_instrucaoRec1.indexOf('>', int_pos);
                    str_campo = str_instrucaoRec1.substring(int_pos, int_tam + 1);

                    switch (str_campo) {
                        case "<mes>":
                            str_instrucaoRec1 = str_instrucaoRec1.replace(str_campo, boletoBancario.dataVencimento.toLocaleDateString('pt-BR', { month: 'long' }));
                            break;

                        case '<ano>':
                            str_instrucaoRec1 = str_instrucaoRec1.replace(str_campo, boletoBancario.dataVencimento.getFullYear().toString());
                            break;

                        case '<diasvencimento>':
                            str_instrucaoRec1 = str_instrucaoRec1.replace(str_campo, boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto.toString());
                            break;

                        case '<multaperc>':
                            str_instrucaoRec1 = str_instrucaoRec1.replace(str_campo, boletoBancario.boleto.contaCorrente.percMulta.toString());
                            break;
                    }

                    int_pos++;
                }
            }
            console.log("str_instrucaoRec1: ", str_instrucaoRec1);

            int_pos = 0;
            int_tam = 0;
            str_campo = "";
            if (str_instrucaoRec2.length > 0) {
                while (str_instrucaoRec2.indexOf('<', int_pos) > -1) {
                    int_pos = str_instrucaoRec2.indexOf('<', int_pos);
                    int_tam = str_instrucaoRec2.indexOf('>', int_pos);
                    str_campo = str_instrucaoRec2.substring(int_pos, int_tam + 1);

                    switch (str_campo) {
                        case "<mes>":
                            str_instrucaoRec2 = str_instrucaoRec2.replace(str_campo, boletoBancario.dataVencimento.toLocaleDateString('pt-BR', { month: 'long' }));
                            break;

                        case '<ano>':
                            str_instrucaoRec2 = str_instrucaoRec2.replace(str_campo, boletoBancario.dataVencimento.getFullYear().toString());
                            break;

                        case '<diasvencimento>':
                            str_instrucaoRec2 = str_instrucaoRec2.replace(str_campo, boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto.toString());
                            break;

                        case '<multaperc>':
                            str_instrucaoRec2 = str_instrucaoRec2.replace(str_campo, boletoBancario.boleto.contaCorrente.percMulta.toString());
                            break;
                    }

                    int_pos++;
                }
            }
            console.log("str_instrucaoRec2: ", str_instrucaoRec2);

            int_pos = 0;
            int_tam = 0;
            str_campo = "";
            if (str_instrucaoRec3.length > 0) {
                while (str_instrucaoRec3.indexOf('<', int_pos) > -1) {
                    int_pos = str_instrucaoRec3.indexOf('<', int_pos);
                    int_tam = str_instrucaoRec3.indexOf('>', int_pos);
                    str_campo = str_instrucaoRec3.substring(int_pos, int_tam + 1);

                    switch (str_campo) {
                        case "<mes>":
                            str_instrucaoRec3 = str_instrucaoRec3.replace(str_campo, boletoBancario.dataVencimento.toLocaleDateString('pt-BR', { month: 'long' }));
                            break;

                        case '<ano>':
                            str_instrucaoRec3 = str_instrucaoRec3.replace(str_campo, boletoBancario.dataVencimento.getFullYear().toString());
                            break;

                        case '<diasvencimento>':
                            str_instrucaoRec3 = str_instrucaoRec3.replace(str_campo, boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto.toString());
                            break;

                        case '<multaperc>':
                            str_instrucaoRec3 = str_instrucaoRec3.replace(str_campo, boletoBancario.boleto.contaCorrente.percMulta.toString());
                            break;
                    }

                    int_pos++;
                }
            }
            console.log("str_instrucaoRec3: ", str_instrucaoRec3);

            int_pos = 0;
            int_tam = 0;
            str_campo = "";
            if (str_instrucaoRec4.length > 0) {
                while (str_instrucaoRec4.indexOf('<', int_pos) > -1) {
                    int_pos = str_instrucaoRec4.indexOf('<', int_pos);
                    int_tam = str_instrucaoRec4.indexOf('>', int_pos);
                    str_campo = str_instrucaoRec4.substring(int_pos, int_tam + 1);

                    switch (str_campo) {
                        case "<mes>":
                            str_instrucaoRec4 = str_instrucaoRec4.replace(str_campo, boletoBancario.dataVencimento.toLocaleDateString('pt-BR', { month: 'long' }));
                            break;

                        case '<ano>':
                            str_instrucaoRec4 = str_instrucaoRec4.replace(str_campo, boletoBancario.dataVencimento.getFullYear().toString());
                            break;

                        case '<diasvencimento>':
                            str_instrucaoRec4 = str_instrucaoRec4.replace(str_campo, boletoBancario.boleto.contaCorrente.qtdeDiasAposVencto.toString());
                            break;

                        case '<multaperc>':
                            str_instrucaoRec4 = str_instrucaoRec4.replace(str_campo, boletoBancario.boleto.contaCorrente.percMulta.toString());
                            break;
                    }

                    int_pos++;
                }
            }
            console.log("str_instrucaoRec4: ", str_instrucaoRec4);


            str_pos = 'Montando JSON';
            let envioJSON: BoletoSicredi = {
                tipoCobranca: "NORMAL",
                codigoBeneficiario: boletoBancario.boleto.contaCorrente.convenio,
                especieDocumento: boletoBancario.especieCod,
                nossoNumero: undefined,
                seuNumero: boletoBancario.id.toString().padStart(10, '0'),
                idTituloEmpresa: boletoBancario.boleto.empresaId.toString().padStart(5, '0') + boletoBancario.boletoId.toString().padStart(15, '0'),
                dataVencimento: boletoBancario.dataVencimento.toISOString().split('T')[0],
                diasProtestoAuto: !boletoBancario.protestar ? undefined :
                    (boletoBancario.protestar ? boletoBancario.qtdeDiasProtesto : undefined),
                diasNegativacaoAuto: !boletoBancario.negativar ? undefined :
                    (boletoBancario.negativar ? boletoBancario.qtdeDiasNegativar : undefined),
                validadeAposVencimento: boletoBancario.qtdeDiasProtesto && boletoBancario.qtdeDiasProtesto > 0 ? boletoBancario.qtdeDiasProtesto : undefined,
                valor: boletoBancario.valor,
                tipoDesconto: boletoBancario.tipoDescontoCobCod ? boletoBancario.tipoDescontoCobCod.indexOf('SEM') > -1 ? undefined : boletoBancario.tipoDescontoCobCod : undefined,
                valorDesconto1: boletoBancario.tipoDescontoCobCod ? boletoBancario.tipoDescontoCobCod.indexOf('SEM') > -1 ? undefined : (boletoBancario.tipoDescontoCobCod === 'VALOR' ? boletoBancario.valorDesconto : boletoBancario.percDesconto) : undefined,
                dataDesconto1: boletoBancario.tipoDescontoCobCod ? boletoBancario.tipoDescontoCobCod.indexOf('SEM') > -1 ? undefined : (
                    addDays(boletoBancario.dataVencimento, boletoBancario.diasInicioDesconto).toISOString().split('T')[0]) : undefined,
                valorDesconto2: undefined,

                dataDesconto2: undefined,
                valorDesconto3: undefined,

                dataDesconto3: undefined,
                tipoJuros: boletoBancario.tipoJurosCobCod ? boletoBancario.tipoJurosCobCod.indexOf('SEM') > -1 ? undefined : (
                    boletoBancario.tipoJurosCobCod.includes('VALOR') ? 'VALOR' : 'PERCENTUAL') : undefined,
                tipoJurosPercentual: boletoBancario.tipoJurosCobCod ? boletoBancario.tipoJurosCobCod.indexOf('SEM') > -1 ? undefined : (
                    boletoBancario.tipoJurosCobCod.includes('DIARIO') ? 'DIARIO' : 'MENSAL') : undefined,
                juros: boletoBancario.tipoJurosCobCod ? boletoBancario.tipoJurosCobCod.indexOf('SEM') > -1 ? undefined : (
                    boletoBancario.tipoJurosCobCod.includes('VALOR') ? boletoBancario.valorJuros : boletoBancario.percJuros) : undefined,
                dataInicioJuros: boletoBancario.tipoJurosCobCod ? boletoBancario.tipoJurosCobCod.indexOf('SEM') > -1 ? undefined : (
                    addDays(boletoBancario.dataVencimento, boletoBancario.diasInicioJuros).toISOString().split('T')[0]) : undefined,
                tipoMulta: boletoBancario.tipoMultaCobCod ? boletoBancario.tipoMultaCobCod.indexOf('SEM') > -1 ? undefined : boletoBancario.tipoMultaCobCod : undefined,
                multa: boletoBancario.tipoMultaCobCod ? boletoBancario.tipoMultaCobCod.indexOf('SEM') > -1 ? undefined : (
                    boletoBancario.tipoMultaCobCod.includes('VALOR') ? boletoBancario.valorMulta : boletoBancario.percMulta) : undefined,
                dataInicioMulta: boletoBancario.tipoMultaCobCod ? boletoBancario.tipoMultaCobCod.indexOf('SEM') > -1 ? undefined :
                    addDays(boletoBancario.dataVencimento, boletoBancario.diasInicioMulta).toISOString().split('T')[0] : undefined,
                informativos: ((str_instrucaoCob1.length > 0 ||
                    str_instrucaoCob2.length > 0 ||
                    str_instrucaoCob3.length > 0) ? [str_instrucaoCob1, str_instrucaoCob2, str_instrucaoCob3] :
                    undefined),
                mensagens: ((str_instrucaoCob1.length > 0 ||
                    str_instrucaoCob2.length > 0 ||
                    str_instrucaoCob3.length > 0) ? [str_instrucaoCob1, str_instrucaoCob2, str_instrucaoCob3] :
                    undefined),
                pagador: {
                    tipoPessoa: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        (boletoBancario.boleto.locacao.locatarios[0].pessoa.documento.replace(/\D/g, '').length > 11 ? 'PESSOA_JURIDICA' : 'PESSOA_FISICA') :
                        (boletoBancario.boleto.imovel.proprietarios[0].pessoa.documento.replace(/\D/g, '').length > 11 ? 'PESSOA_JURIDICA' : 'PESSOA_FISICA')
                    ),
                    documento: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        (boletoBancario.boleto.locacao.locatarios[0].pessoa.documento.replace(/\D/g, '').length > 11 ? boletoBancario.boleto.locacao.locatarios[0].pessoa.documento.replace(/\D/g, '').padStart(14, '0') : boletoBancario.boleto.locacao.locatarios[0].pessoa.documento.replace(/\D/g, '').padStart(11, '0')) :
                        (boletoBancario.boleto.imovel.proprietarios[0].pessoa.documento.replace(/\D/g, '').length > 11 ? boletoBancario.boleto.imovel.proprietarios[0].pessoa.documento.replace(/\D/g, '').padStart(14, '0') : boletoBancario.boleto.imovel.proprietarios[0].pessoa.documento.replace(/\D/g, '').padStart(11, '0'))
                    ),
                    nome: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.nome :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.nome),
                    endereco: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.logradouro + ', ' +
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.numero +
                        (boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.complemento ? boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.complemento + ' - ' : '') :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.logradouro + ', ' +
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.numero +
                        (boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.complemento ? boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.complemento + ' - ' : '')
                    ),
                    cidade: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.cidade :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.cidade),
                    uf: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.estado :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.estado),
                    cep: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.endereco.cep.replace(/\D/g, '') :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.endereco.cep.replace(/\D/g, '')),
                    telefone: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        (boletoBancario.boleto.locacao.locatarios[0].pessoa.telefone ? boletoBancario.boleto.locacao.locatarios[0].pessoa.telefone.replace(/\D/g, '') : undefined) :
                        (boletoBancario.boleto.imovel.proprietarios[0].pessoa.telefone ? boletoBancario.boleto.imovel.proprietarios[0].pessoa.telefone.replace(/\D/g, '') : undefined)),
                    email: ((boletoBancario.boleto.locacao && boletoBancario.boleto.locacao.locatarios.length > 0) ?
                        boletoBancario.boleto.locacao.locatarios[0].pessoa.email :
                        boletoBancario.boleto.imovel.proprietarios[0].pessoa.email),
                },
                beneficiarioFinal: undefined,
                /*beneficiarioFinal: {
                    tipoPessoa: (boletoBancario.boleto.empresa.cnpj.replace(/\D/g, '').length > 11 ? 'PESSOA_JURIDICA' : 'PESSOA_FISICA'),
                    documento: boletoBancario.boleto.empresa.cnpj.replace(/\D/g, ''),
                    nome: boletoBancario.boleto.empresa.nome,
                    logreadouro: boletoBancario.boleto.empresa.endereco.logradouro,
                    numeroEndereco: boletoBancario.boleto.empresa.endereco.numero,
                    cidade: boletoBancario.boleto.empresa.endereco.cidade,
                    uf: boletoBancario.boleto.empresa.endereco.estado,
                    cep: boletoBancario.boleto.empresa.endereco.cep.replace(/\D/g, ''),
                    telefone: boletoBancario.boleto.empresa.telefone.replace(/\D/g, ''),
                    email: boletoBancario.boleto.empresa.email,
                }*/

            };

            //console.log('Envio: ', envioJSON);
            //busca token
            str_pos = 'busca token';
            //const tokenData = new FormData();
            const tokenData = new URLSearchParams();

            tokenData.append('grant_type', 'password');
            tokenData.append('username', boletoBancario.boleto.contaCorrente.convenio + boletoBancario.boleto.contaCorrente.cooperativa);
            tokenData.append('password', boletoBancario.boleto.contaCorrente.senhaBancoAPI);
            tokenData.append('scope', 'cobranca');

            //const responseToken = await this.httpService.axiosRef.post('https://api-parceiro.sicredi.com.br/sb/auth/openapi/token', tokenData //Sandbox
            const responseToken = await this.httpService.axiosRef.post('https://api-parceiro.sicredi.com.br/auth/openapi/token', tokenData
                , {
                    headers: {
                        'x-api-key': boletoBancario.boleto.contaCorrente.chaveAppAPI,
                        'context': 'COBRANCA',
                    }
                }
            );

            str_pos = 'Voltou token';
            if (responseToken) {
                console.log('json:', envioJSON);

                const responseOrder = await this.httpService.axiosRef.post(boletoBancario.boleto.contaCorrente.urlBoleto, envioJSON, {
                    //const responseOrder = await this.httpService.axiosRef.post('https://devportal.itau.com.br/sandboxapi/cash_management_ext_v2/v2', envioJSON, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': boletoBancario.boleto.contaCorrente.chaveAppAPI,
                        'cooperativa': boletoBancario.boleto.contaCorrente.cooperativa,
                        'posto': boletoBancario.boleto.contaCorrente.digito, //Campo Dígito da conta no banco de dados
                        'Authorization': `Bearer ${responseToken.data.access_token}`
                    }
                });

                if (responseOrder) {
                    //Boleto criado com sucesso
                    if (responseOrder.status === 201) {
                        console.log('responde data:', responseOrder.data);
                        //Atualiza boleto bancário
                        await this.prismaService.boletoBancario.update(
                            {
                                where: {
                                    id: boletoBancario.id
                                },
                                data: {
                                    codigoBarras: responseOrder.data.codigoBarras ? responseOrder.data.codigoBarras : '',
                                    linhaDigitavel: responseOrder.data.linhaDigitavel ? responseOrder.data.linhaDigitavel : '',
                                    nossoNumero: responseOrder.data.nossoNumero ? responseOrder.data.nossoNumero : '',
                                    txid: responseOrder.data.txid ? responseOrder.data.txid : '',
                                    qrcode: responseOrder.data.qrcode ? responseOrder.data.qrcode : '',
                                    status: 'REGISTRADO',
                                    registrado: 'S',
                                }
                            }
                        );

                        //Atualiza boleto previsão de pagamento
                        await this.prismaService.boleto.update(
                            {
                                where: {
                                    id: boletoBancario.boletoId
                                },
                                data: {
                                    status: BoletoStatus.CONFIRMADO,
                                }
                            }
                        );
                    }
                }
            }
        }
        catch (error) {
            console.log('Posição: ', str_pos);
            if (isAxiosError(error)) {
                // Check if there's a response and data within the error
                if (error.response && error.response.data) {
                    console.log('Response: ', error.response);
                    console.error('Error message from server:', error.response.data);

                    // You can also set this error message to a state to display it in your UI
                } else {
                    console.error('Axios error without response data:', error.message);
                }
            } else {
                console.error('Non-Axios error:', error);
            }

        }

    }

    /**Baixa boleto Banco Sicredi */
    async DownloadBoleto748(boletobancarioId: number) {

        let result: any;
        await new Promise((resolve: any) => {
            try {
                this.prismaService.boletoBancario.findUnique({
                    where: {
                        id: boletobancarioId
                    },
                    include: {
                        boleto: {
                            include: {
                                empresa: {
                                    include: {
                                        endereco: true,
                                    }
                                },
                                contaCorrente: true,
                            }
                        },
                    },
                }).then((boletoBancario) => {
                    //console.log('Envio: ', envioJSON);
                    //busca token
                    //const tokenData = new FormData();
                    const tokenData = new URLSearchParams();

                    console.log('user : ', boletoBancario.boleto.contaCorrente.convenio + boletoBancario.boleto.contaCorrente.cooperativa);
                    tokenData.append('grant_type', 'password');
                    tokenData.append('username', boletoBancario.boleto.contaCorrente.convenio + boletoBancario.boleto.contaCorrente.cooperativa);
                    tokenData.append('password', boletoBancario.boleto.contaCorrente.senhaBancoAPI);
                    tokenData.append('scope', 'cobranca');

                    //const responseToken = await this.httpService.axiosRef.post('https://api-parceiro.sicredi.com.br/sb/auth/openapi/token', tokenData //Sandbox
                    this.httpService.axiosRef.post('https://api-parceiro.sicredi.com.br/auth/openapi/token', tokenData
                        , {
                            headers: {
                                'x-api-key': boletoBancario.boleto.contaCorrente.chaveAppAPI,
                                'context': 'COBRANCA',
                            }
                        }
                    ).then((responseToken) => {

                        this.httpService.axiosRef.get(boletoBancario.boleto.contaCorrente.urlBoleto + '/pdf?linhaDigitavel=' + boletoBancario.linhaDigitavel, {
                            //const responseOrder = await this.httpService.axiosRef.post('https://devportal.itau.com.br/sandboxapi/cash_management_ext_v2/v2', envioJSON, {
                            headers: {
                                'x-api-key': boletoBancario.boleto.contaCorrente.chaveAppAPI,
                                'Authorization': `Bearer ${responseToken.data.access_token}`,
                            },
                            responseType: 'arraybuffer'
                        }).then(response => {
                            console.log('fim responsew');
                            result = response.data;
                            fs.writeFileSync('boletosicredi.pdf', response.data);
                            resolve();

                        }).catch(error => {
                            if (isAxiosError(error)) {
                                // Check if there's a response and data within the error
                                if (error.response && error.response.data) {
                                    console.log('Response: ', error.response);
                                    //console.error('Error message from server:', error.response.data);
                                    console.log('catch fim erro 1');
                                    throw new BadRequestException(error.response.data);
                                } else {
                                    //console.error('Axios error without response data:', error.message);
                                    console.log('catch fim erro 2');
                                    throw new BadRequestException(error.message);
                                }
                            } else {
                                //console.error('Non-Axios error:', error);
                                console.log('catch fim erro 3');
                                //throw new BadRequestException(error);
                            }
                        });
                    });
                });
            }
            catch (error) {

                if (isAxiosError(error)) {
                    // Check if there's a response and data within the error
                    if (error.response && error.response.data) {
                        //console.log('Response: ', error.response);
                        //console.error('Error message from server:', error.response.data);
                        console.log('fim erro 1');
                        throw new BadRequestException(error.response.data);
                    } else {
                        //console.error('Axios error without response data:', error.message);
                        console.log('fim erro 2');
                        throw new BadRequestException(error.message);
                    }
                } else {
                    //console.error('Non-Axios error:', error);
                    console.log('fim erro 3');
                    throw new BadRequestException(error);
                }

            }
        });
        return result;
    }

    /**Baixa boleto Banco Sicredi */
    async BaixaBoleto748(boletobancarioId: number) {
        try {
            const boletoBancario = await this.prismaService.boletoBancario.findUnique({
                where: {
                    id: boletobancarioId
                },
                include: {
                    boleto: {
                        include: {
                            empresa: {
                                include: {
                                    endereco: true,
                                }
                            },
                            contaCorrente: true,
                        }
                    },
                },
            });

            //busca token
            const tokenData = new URLSearchParams();

            tokenData.append('grant_type', 'password');
            tokenData.append('username', boletoBancario.boleto.contaCorrente.convenio + boletoBancario.boleto.contaCorrente.cooperativa);
            tokenData.append('password', 'teste123');
            tokenData.append('scope', 'cobranca');

            //const responseToken = await this.httpService.axiosRef.post('https://api-parceiro.sicredi.com.br/sb/auth/openapi/token', tokenData
            const responseToken = await this.httpService.axiosRef.post('https://api-parceiro.sicredi.com.br/auth/openapi/token', tokenData
                , {
                    headers: {
                        'x-api-key': boletoBancario.boleto.contaCorrente.chaveAppAPI,
                        'context': 'COBRANCA',
                    }
                }
            );

            if (responseToken) {
                const responseOrder = await this.httpService.axiosRef.patch(boletoBancario.boleto.contaCorrente.urlBoleto + `/${boletoBancario.nossoNumero}/baixa`, {}, {
                    //const responseOrder = await this.httpService.axiosRef.post('https://devportal.itau.com.br/sandboxapi/cash_management_ext_v2/v2', envioJSON, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': boletoBancario.boleto.contaCorrente.chaveAppAPI,
                        'cooperativa': boletoBancario.boleto.contaCorrente.cooperativa,
                        'posto': boletoBancario.boleto.contaCorrente.digito,
                        'codigoBeneficiario': boletoBancario.boleto.contaCorrente.convenio,
                        'Authorization': `Bearer ${responseToken.data.access_token}`
                    }
                });

                if (responseOrder) {
                    console.log('baixou: ', responseOrder);
                    //Boleto baixado com sucesso
                    if (responseOrder.status === 202) {
                        await this.prismaService.boletoBancario.update(
                            {
                                where: {
                                    id: boletoBancario.id
                                },
                                data: {
                                    status: 'BAIXADO MANUALMENTE',
                                }
                            }
                        );
                    }
                }
            }
        }
        catch (error) {
            if (isAxiosError(error)) {
                // Check if there's a response and data within the error
                if (error.response && error.response.data) {
                    console.log('Response: ', error.response);
                    console.error('Error message from server:', error.response.data);

                    // You can also set this error message to a state to display it in your UI
                } else {
                    console.error('Axios error without response data:', error.message);
                }
            } else {
                console.error('Non-Axios error:', error);
            }

        }
    }

    /**Baixa boleto Banco Sicredi */
    async ConsultaBoleto748(boletobancarioId: number) {
        try {
            const boletoBancario = await this.prismaService.boletoBancario.findUnique({
                where: {
                    id: boletobancarioId
                },
                include: {
                    boleto: {
                        include: {
                            empresa: {
                                include: {
                                    endereco: true,
                                }
                            },
                            contaCorrente: true,
                        }
                    },
                },
            });

            //busca token
            const tokenData = new URLSearchParams();

            tokenData.append('grant_type', 'password');
            tokenData.append('username', boletoBancario.boleto.contaCorrente.convenio + boletoBancario.boleto.contaCorrente.cooperativa);
            tokenData.append('password', boletoBancario.boleto.contaCorrente.senhaBancoAPI);
            tokenData.append('scope', 'cobranca');

            //const responseToken = await this.httpService.axiosRef.post('https://api-parceiro.sicredi.com.br/sb/auth/openapi/token', tokenData
            const responseToken = await this.httpService.axiosRef.post('https://api-parceiro.sicredi.com.br/auth/openapi/token', tokenData
                , {
                    headers: {
                        'x-api-key': boletoBancario.boleto.contaCorrente.chaveAppAPI,
                        'context': 'COBRANCA',
                    }
                }
            );

            if (responseToken) {
                //console.log('token: ', responseToken);
                //console.log('nossonumero: ', boletoBancario.nossoNumero.substring(0, 8));

                const responseOrder = await this.httpService.axiosRef.get(boletoBancario.boleto.contaCorrente.urlBoleto + `?codigoBeneficiario=${boletoBancario.boleto.contaCorrente.convenio}&nossoNumero=${boletoBancario.nossoNumero.substring(0, 9)}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': boletoBancario.boleto.contaCorrente.chaveAppAPI,
                        'cooperativa': boletoBancario.boleto.contaCorrente.cooperativa,
                        'posto': boletoBancario.boleto.contaCorrente.digito,
                        'Authorization': `Bearer ${responseToken.data.access_token}`
                    }
                });

                if (responseOrder) {
                    //Sucesso
                    if (responseOrder.status === 200) {
                        console.log('resposta: ', responseOrder.data);
                        await this.prismaService.boletoBancario.update(
                            {
                                where: {
                                    id: boletoBancario.id
                                },
                                data: {
                                    status: responseOrder.data.situacao,
                                }
                            }
                        );
                    }
                }
            }
        }
        catch (error) {
            if (isAxiosError(error)) {
                // Check if there's a response and data within the error
                if (error.response && error.response.data) {
                    console.log('Response: ', error.response);
                    console.error('Error message from server:', error.response.data);
                    throw new BadRequestException(error.response.data);
                    // You can also set this error message to a state to display it in your UI
                } else {
                    console.error('Axios error without response data:', error.message);
                    throw new BadRequestException(error.message);
                }
            } else {
                console.error('Non-Axios error:', error);
                throw new BadRequestException(error);

            }

        }
    }
}

function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}