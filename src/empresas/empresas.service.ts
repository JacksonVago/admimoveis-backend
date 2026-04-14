import { FileData } from '@/common/interfaces/file-data';
import { FilesAzureService } from '@/files/azurefiles.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { MemoryStoredFile } from 'nestjs-form-data';
import { CreateEmpresaDto } from './empresas.controller';

@Injectable()
export class EmpresasService {
  constructor(
    private readonly PrismaService: PrismaService,
    private filesAzureService: FilesAzureService,
  ) { }
  async create(createEmpresaDto: CreateEmpresaDto) {
    const checkIfUserExists = await this.PrismaService.empresa.findUnique({
      where: {
        cnpj: createEmpresaDto.cnpj,
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' empresa exists');
    }

    const result = await this.PrismaService.empresa.create({
      data: {
        nome: createEmpresaDto.nome,
        cnpj: createEmpresaDto.cnpj,
        telefone: createEmpresaDto.telefone,
        email: createEmpresaDto.email,
        status: createEmpresaDto.status,
        avisosReajusteLocacao: createEmpresaDto.avisosReajusteLocacao,
        avisosRenovacaoContrato: createEmpresaDto.avisosRenovacaoContrato,
        avisosSeguroFianca: createEmpresaDto.avisosSeguroFianca,
        avisosSeguroIncendio: createEmpresaDto.avisosSeguroIncendio,
        avisosTituloCapitalizacao: createEmpresaDto.avisosTituloCapitalizacao,
        avisosDepositoCalcao: createEmpresaDto.avisosDepositoCalcao,
        porcentagemComissao: createEmpresaDto.porcentagemComissao,
        logo: createEmpresaDto.logo,
        emiteBoleto: createEmpresaDto.emiteBoleto,
        valorTaxaBoleto: createEmpresaDto.valorTaxaBoleto,
        emissaoBoletoAntecedencia: createEmpresaDto.emissaoBoletoAntecedencia,
        porcentagemMultaAtraso: createEmpresaDto.porcentagemMultaAtraso,
        porcentagemJurosAtraso: createEmpresaDto.porcentagemJurosAtraso,
        tipoLancamento: createEmpresaDto.tipoId,

        endereco: {
          create: {
            logradouro: createEmpresaDto?.logradouro,
            numero: createEmpresaDto?.numero,
            bairro: createEmpresaDto?.bairro,
            cidade: createEmpresaDto?.cidade,
            estado: createEmpresaDto?.estado,
            cep: createEmpresaDto?.cep,
            complemento: createEmpresaDto?.complemento,
          },
        }
      },
      include: {
        endereco: true
      },
    });

    //Verifica se tem anexos
    if (createEmpresaDto?.documentos?.length) {
      await this.createEmpresaDocuments(result.id, createEmpresaDto.documentos);
    }

    return result;
  }

  async update(id: number, data: CreateEmpresaDto) {
    await this.checkEmpresaExists(id);

    const existingEmpresa = await this.PrismaService.empresa.findUnique({
      where: {
        id,
      },
    });

    const {
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      complemento,
      ...empresaData
    } = data;
    // Atualiza os dados do imóvel

    console.log('data', data);

    const result = await this.PrismaService.empresa.update({
      where: { id },
      data: {
        nome: data.nome,
        cnpj: data.cnpj,
        telefone: data.telefone,
        email: data.email,
        status: data.status,
        emiteBoleto: data.emiteBoleto,
        avisosReajusteLocacao: data.avisosReajusteLocacao,
        avisosRenovacaoContrato: data.avisosRenovacaoContrato,
        avisosSeguroFianca: data.avisosSeguroFianca,
        avisosSeguroIncendio: data.avisosSeguroIncendio,
        avisosTituloCapitalizacao: data.avisosTituloCapitalizacao,
        avisosDepositoCalcao: data.avisosDepositoCalcao,
        porcentagemComissao: data.porcentagemComissao,
        valorTaxaBoleto: data.valorTaxaBoleto,
        emissaoBoletoAntecedencia: data.emissaoBoletoAntecedencia,
        porcentagemMultaAtraso: data.porcentagemMultaAtraso,
        porcentagemJurosAtraso: data.porcentagemJurosAtraso,
        tipoLancamento: data.tipoId,
        logo: data.logo,

        //if we have any address data, update it
        endereco:
          logradouro ||
            numero ||
            bairro ||
            cidade ||
            estado ||
            cep ||
            complemento
            ? {
              update: {
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                complemento,
              },
            }
            : undefined,
      },
      include: { endereco: true },
    });
    //check if we have a new valores to gerenate ImovelValorHistorico

    if (existingEmpresa.logo && data.logo !== existingEmpresa.logo && (existingEmpresa.logo !== "" && existingEmpresa.logo !== null)) {
      //Exclui arquivo da nuvem
      await this.filesAzureService.deleteFile(existingEmpresa.logo);
    }
    else if (data.documentos?.length) {
      await this.createEmpresaDocuments(id, data.documentos);
    }

    return result;
  }

  async get(id: number) {
    return await this.PrismaService.empresa.findUnique({
      where: {
        id: id,
      },
      include: {
        endereco: true
      }
    });
  }

  async getMany() {
    return await this.PrismaService.empresa.findMany({
      include: {
        endereco: true
      }
    });
  }

  private async checkEmpresaExists(id: number) {
    const empresa = await this.PrismaService.empresa.findUnique({
      where: {
        id: id,
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa not found');
    }
  }

  async createEmpresaDocuments(
    EmpresaId: number,
    files: MemoryStoredFile[],
  ) {
    try {
      // Crie uma lista de promessas para processar cada arquivo
      files.map(async (file) => {
        // Converta o MemoryStoredFile para o formato necessário
        const adaptedFile: FileData = {
          filename: `${randomUUID()}.${file.originalName?.split('.').pop()}`,
          originalname: file.originalName,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
          encoding: file.encoding,
        };

        const folder = 'admimoveis/' + EmpresaId.toString() + '/empresas/' + file.originalName.replaceAll(' ', '_');

        const url = await this.filesAzureService.uploadFile(folder, file);
      });

      const results = await Promise.all("ok");

      return results;
    } catch (error) {
      console.error('Error on createEmpresaDocuments', error);
    }
  }
}
