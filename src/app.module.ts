import { Module } from '@nestjs/common';
import { AlertaModule } from './alertas/alerta.module';
import { AssinaturaModule } from './assinatura/assinatura.module';
import { AuthModule } from './auth/auth.module';
import { BancoModule } from './bancos/banco.module';
import { BlocoModule } from './blocos/bloco.module';
import { BoletoBancarioModule } from './boletos/boletobancario.module';
import { CarteiraCobrancaModule } from './carteiracobranca/carteiracobranca.module';
import { CepModule } from './cep/cep.module';
import { CondominioModule } from './condominios/condominio.module';
import { ContaCorrenteModule } from './contascorrente/contacorrente.module';
import { MailModule } from './email/email.module';
import { EmpresaModule } from './empresas/empresas.module';
import { EnvModule } from './env/env.module';
import { EspecieCobrancaModule } from './especiecobranca/especiecobranca.module';
import { FilesModule } from './files/files.module';
import { GrupoFluxoCaixaModule } from './grupofluxocaixa/grupofluxocaixa.module';
import { ImoveisModule } from './imoveis/imoveis.module';
import { InstrucaoCobrancaModule } from './instrucaocobranca/instrucaocobranca.module';
import { InstrucaoRecebimentosModule } from './instrucaorecebimento/instrucaorecebimento.module';
import { JobsModule } from './jobs/jobs.module';
import { LancamentoModule } from './lancamentos/lancamentos.module';
import { LancamentoCondominioModule } from './lancamentosCondominios/lanctosCondominios.module';
import { LancamentoImoveisModule } from './lancamentosImoveis/lancamentosimoveis.module';
import { LocacaoModule } from './locacoes/locacoes.module';
import { MoradoresModule } from './moradores/moradores.module';
import { PagamentoModule } from './pagamentos/pagamentos.module';
import { PagSeguroModule } from './pagseguro/pagseguro.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProprietariosModule } from './proprietarios/proprietarios.module';
import { ReajusteModule } from './reajustes/reajustes.module';
import { RepasseModule } from './repasses/repasses.module';
import { TipoAlertaModule } from './tipoalerta/tipoalerta.module';
import { TipoAutorizacaoModule } from './tipoaurizacao/tipoautorizacao.module';
import { TipoDescontoModule } from './tipodesconto/tipodesconto.module';
import { TipoImovelModule } from './tipoimovel/tipoimovel.module';
import { TipoJurosModule } from './tipojuros/tipojuros.module';
import { TipoLancamentoModule } from './tipolancamento/tipolancamento.module';
import { TipoMultaModule } from './tipomulta/tipomulta.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    //queueConfig,
    //bullboardConfig,
    EnvModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    PessoasModule,
    ProprietariosModule,
    ImoveisModule,
    LocacaoModule,
    FilesModule,
    CepModule,
    TipoImovelModule,
    EmpresaModule,
    TipoLancamentoModule,
    LancamentoModule,
    ReajusteModule,
    PagamentoModule,
    RepasseModule,
    CondominioModule,
    AssinaturaModule,
    PagSeguroModule,
    BlocoModule,
    LancamentoCondominioModule,
    MoradoresModule,
    LancamentoImoveisModule,
    //QueueModule,
    MailModule,
    TipoAlertaModule,
    ContaCorrenteModule,
    JobsModule,
    AlertaModule,
    InstrucaoCobrancaModule,
    BancoModule,
    InstrucaoRecebimentosModule,
    CarteiraCobrancaModule,
    EspecieCobrancaModule,
    TipoJurosModule,
    TipoMultaModule,
    TipoDescontoModule,
    TipoAutorizacaoModule,
    BoletoBancarioModule,
    GrupoFluxoCaixaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
