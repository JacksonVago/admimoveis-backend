/*const crypto = require('crypto');
const { execSync } = require('child_process');
const fs = require('fs');
const https = require('https');
const path = require('path');
const readline = require('readline');

const _DIR_RAIZ = path.join(__dirname, '..'); // sobe de node/ para certificado-dinamico/

const PASTA_SAIDA = path.join(_DIR_RAIZ, 'output');
const PASTA_ETAPA1 = path.join(PASTA_SAIDA, 'etapa1');
const PASTA_ETAPA2 = path.join(PASTA_SAIDA, 'etapa2');
const PASTA_ETAPA4 = path.join(PASTA_SAIDA, 'etapa4');
const PASTA_LOGS = path.join(PASTA_SAIDA, 'logs');
const ARQUIVO_ESTADO = path.join(PASTA_SAIDA, 'estado_certificado.json');

function mascarar(valor) {
    if (!valor || typeof valor !== 'string') return '******';
    valor = valor.trim();
    if (valor.length <= 6) return '******';
    return valor.substring(0, 3) + '******' + valor.substring(valor.length - 3);
}

let logStream = null;

function configurarLog() {
    if (!fs.existsSync(PASTA_LOGS)) fs.mkdirSync(PASTA_LOGS, { recursive: true });
    const now = new Date();
    const timestamp = now.getFullYear()
        + String(now.getMonth() + 1).padStart(2, '0')
        + String(now.getDate()).padStart(2, '0') + '_'
        + String(now.getHours()).padStart(2, '0')
        + String(now.getMinutes()).padStart(2, '0')
        + String(now.getSeconds()).padStart(2, '0');
    const arquivoLog = path.join(PASTA_LOGS, `certificado_dinamico_${timestamp}.log`);
    logStream = fs.createWriteStream(arquivoLog, { flags: 'a' });
    return arquivoLog;
}

function log(nivel, mensagem) {
    if (!logStream) return;
    const now = new Date();
    const ts = now.toISOString().replace('T', ' ').substring(0, 19);
    logStream.write(`${ts} [${nivel}] ${mensagem}\n`);
}

function detalharErroHttp(statusCode) {
    const descricoes = {
        400: 'Requisicao invalida. O CSR pode estar malformado ou os dados enviados estao incorretos.',
        401: 'Nao autorizado. O token pode estar invalido, expirado ou nao foi informado corretamente. Tente executar novamente a partir da etapa 2.',
        403: 'Acesso negado. O token nao tem permissao para esta operacao ou esta expirado. Tente executar novamente a partir da etapa 2 para obter um novo token.',
        404: 'Endpoint nao encontrado. Verifique se a URL do STS Itau esta correta.',
        500: 'Erro interno do servidor STS Itau. Tente novamente mais tarde.',
        502: 'Bad Gateway. O servidor STS Itau esta temporariamente indisponivel. Tente novamente mais tarde.',
        503: 'Servico indisponivel. O servidor STS Itau esta em manutencao. Tente novamente mais tarde.',
    };
    return descricoes[statusCode] || `Erro HTTP ${statusCode}. Verifique a documentacao do STS Itau.`;
}

const ETAPAS = {
    1: 'Gerar par de chaves e exibir chave publica',
    2: 'Descriptografar credenciais, gerar e enviar certificado',
    3: 'Testar geracao de token',
};

function carregarEstado() {
    for (const pasta of [PASTA_SAIDA, PASTA_ETAPA1, PASTA_ETAPA2, PASTA_ETAPA4, PASTA_LOGS]) {
        if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });
    }
    if (fs.existsSync(ARQUIVO_ESTADO)) {
        return JSON.parse(fs.readFileSync(ARQUIVO_ESTADO, 'utf8'));
    }
    return { etapaConcluida: 0 };
}

function salvarEstado(estado) {
    fs.writeFileSync(ARQUIVO_ESTADO, JSON.stringify(estado, null, 2), 'utf8');
}

class CertificadoDinamico {

    static gerarParDeChaves(caminhoPrivada = 'private.pem', caminhoPublica = 'public.pem') {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
        });

        fs.writeFileSync(caminhoPrivada, privateKey);
        console.log(`Chave privada salva em ${path.resolve(caminhoPrivada)}`);

        fs.writeFileSync(caminhoPublica, publicKey);
        console.log(`Chave publica salva em ${path.resolve(caminhoPublica)}`);

        return { privateKey, publicKey };
    }

    static descriptografarRSA(caminhoChavePrivada, dadosCifradosBase64) {
        const chavePrivadaPem = fs.readFileSync(caminhoChavePrivada, 'utf8');
        const dadosCifrados = Buffer.from(dadosCifradosBase64, 'base64');

        const decrypted = crypto.privateDecrypt(
            {
                key: chavePrivadaPem,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            dadosCifrados
        );

        return decrypted;
    }

    
    static descriptografarAES(chaveAES, textoCifradoBase64) {
        const textoCifrado = Buffer.from(textoCifradoBase64, 'base64');
        const iv = Buffer.alloc(16);

        const decipher = crypto.createDecipheriv('aes-256-cbc', chaveAES, iv);
        let decrypted = decipher.update(textoCifrado);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString('utf8');
    }

    
    static descriptografarCredenciais(clientIdCifrado, tokenCifrado, chaveSessaoCifrada, caminhoChavePrivada) {
        console.log('\n=========================================');
        console.log('    Processo de Descriptografia           ');
        console.log('=========================================');

        const chaveSessaoDecifrada = CertificadoDinamico.descriptografarRSA(
            caminhoChavePrivada, chaveSessaoCifrada
        );

        const clientIdDecifrado = CertificadoDinamico.descriptografarAES(
            chaveSessaoDecifrada, clientIdCifrado
        );
        console.log(`\nClient ID decifrado com a chave de sessao AES:\n[ ${mascarar(clientIdDecifrado)} ]`);

        const tokenDecifrado = CertificadoDinamico.descriptografarAES(
            chaveSessaoDecifrada, tokenCifrado
        );
        console.log(`\nToken decifrado com a chave de sessao AES:\n[ ${mascarar(tokenDecifrado)} ]`);

        return { clientId: clientIdDecifrado, token: tokenDecifrado };
    }

    static _derEncode(tag, content) {
        const len = content.length;
        let header;
        if (len < 128) {
            header = Buffer.from([tag, len]);
        } else if (len < 256) {
            header = Buffer.from([tag, 0x81, len]);
        } else {
            header = Buffer.from([tag, 0x82, (len >> 8) & 0xFF, len & 0xFF]);
        }
        return Buffer.concat([header, content]);
    }

    static _derSequence(...elements) {
        return CertificadoDinamico._derEncode(0x30, Buffer.concat(elements));
    }

    static _derSet(...elements) {
        return CertificadoDinamico._derEncode(0x31, Buffer.concat(elements));
    }

    static _derBitString(data) {
        return CertificadoDinamico._derEncode(0x03, Buffer.concat([Buffer.from([0x00]), data]));
    }

    static _derUtf8String(str) {
        return CertificadoDinamico._derEncode(0x0C, Buffer.from(str, 'utf8'));
    }

    static _derPrintableString(str) {
        return CertificadoDinamico._derEncode(0x13, Buffer.from(str, 'ascii'));
    }

    static _buildRDN(oidBytes, value, stringTag) {
        const oid = CertificadoDinamico._derEncode(0x06, Buffer.from(oidBytes));
        const val = stringTag === 0x13
            ? CertificadoDinamico._derPrintableString(value)
            : CertificadoDinamico._derUtf8String(value);
        const atv = CertificadoDinamico._derSequence(oid, val);
        return CertificadoDinamico._derSet(atv);
    }

    static gerarCSR(clientId, organizacao, cidade, estado, pais,
                     caminhoCSR = 'ARQUIVO_REQUEST_CERTIFICADO.csr',
                     caminhoChavePrivadaCSR = 'ARQUIVO_CHAVE_PRIVADA.key') {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'der' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        });

        fs.writeFileSync(caminhoChavePrivadaCSR, privateKey);
        console.log(`\nChave privada do CSR salva em ${path.resolve(caminhoChavePrivadaCSR)}`);

        const OID_CN = [0x55, 0x04, 0x03];
        const OID_OU = [0x55, 0x04, 0x0B];
        const OID_L  = [0x55, 0x04, 0x07];
        const OID_ST = [0x55, 0x04, 0x08];
        const OID_C  = [0x55, 0x04, 0x06];

        const subject = CertificadoDinamico._derSequence(
            CertificadoDinamico._buildRDN(OID_C, pais, 0x13),
            CertificadoDinamico._buildRDN(OID_ST, estado, 0x0C),
            CertificadoDinamico._buildRDN(OID_L, cidade, 0x0C),
            CertificadoDinamico._buildRDN(OID_OU, organizacao, 0x0C),
            CertificadoDinamico._buildRDN(OID_CN, clientId, 0x0C)
        );

        const version = CertificadoDinamico._derEncode(0x02, Buffer.from([0x00]));
        const spki = Buffer.isBuffer(publicKey) ? publicKey : Buffer.from(publicKey);
        const attributes = Buffer.from([0xA0, 0x00]);

        const certReqInfo = CertificadoDinamico._derSequence(version, subject, spki, attributes);

        const sign = crypto.createSign('SHA512');
        sign.update(certReqInfo);
        const signatureBytes = sign.sign(privateKey);

        const sha512WithRSA = Buffer.from([
            0x30, 0x0D, 0x06, 0x09, 0x2A, 0x86, 0x48, 0x86,
            0xF7, 0x0D, 0x01, 0x01, 0x0D, 0x05, 0x00
        ]);

        const sigBitString = CertificadoDinamico._derBitString(signatureBytes);
        const csrDer = CertificadoDinamico._derSequence(certReqInfo, sha512WithRSA, sigBitString);

        const csrBase64 = csrDer.toString('base64');
        const csrPem = '-----BEGIN CERTIFICATE REQUEST-----\n' +
            csrBase64.match(/.{1,64}/g).join('\n') +
            '\n-----END CERTIFICATE REQUEST-----\n';

        fs.writeFileSync(caminhoCSR, csrPem);
        console.log(`CSR salvo em ${path.resolve(caminhoCSR)}`);
    }

    static enviarCertificado(token, caminhoCSR = 'ARQUIVO_REQUEST_CERTIFICADO.csr',
                              caminhoCRT = 'certificado.crt') {
        return new Promise((resolve, reject) => {
            const conteudoCSR = fs.readFileSync(caminhoCSR, 'utf8');

            const options = {
                hostname: 'sts.itau.com.br',
                path: '/seguranca/v1/certificado/solicitacao',
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': `Bearer ${token}`,
                },
                rejectUnauthorized: false,
            };

            log('INFO', '=== DETALHES DA REQUISICAO HTTP (Enviar CSR) ===');
            log('INFO', `URL: https://${options.hostname}${options.path}`);
            log('INFO', `Metodo: ${options.method}`);
            log('INFO', `Headers: Content-Type=${options.headers['Content-Type']}, Authorization=Bearer ${mascarar(token)}`);
            log('INFO', `Body (CSR): ${conteudoCSR.substring(0, 200)}${conteudoCSR.length > 200 ? '...' : ''}`);
            log('INFO', `Tamanho do body: ${conteudoCSR.length} bytes`);
            log('INFO', `rejectUnauthorized: ${options.rejectUnauthorized}`);
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    log('INFO', '=== DETALHES DA RESPOSTA HTTP (Enviar CSR) ===');
                    log('INFO', `Status code: ${res.statusCode}`);
                    log('INFO', `Response headers: ${JSON.stringify(res.headers)}`);
                    log('INFO', `Response body (primeiros 500 chars): ${data.substring(0, 500)}`);

                    if (res.statusCode !== 200) {
                        const detalhe = detalharErroHttp(res.statusCode);
                        reject(new Error(`Erro na geracao do certificado. Status: ${res.statusCode}\n  Possivel causa: ${detalhe}\n  Resposta do servidor: ${data.substring(0, 500)}`));
                        return;
                    }

                    const linhas = data.split('\n');
                    let secret = '';
                    const crtContent = [];

                    const uuidPattern = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
                    for (const linha of linhas) {
                        if (linha.includes('Secret:')) {
                            const match = linha.match(uuidPattern);
                            secret = match ? match[0] : linha;
                        } else {
                            crtContent.push(linha);
                        }
                    }

                    fs.writeFileSync(caminhoCRT, crtContent.join('\n'));
                    console.log(`\nCertificado salvo em ${path.resolve(caminhoCRT)}`);
                    console.log(`Client Secret: ${mascarar(secret)}`);

                    resolve(secret);
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Erro ao enviar CSR: ${error.message}`));
            });

            req.write(conteudoCSR);
            req.end();
        });
    }

    static obterTokenOAuth(clientId, clientSecret, caminhoCRT, caminhoKey) {
        return new Promise((resolve, reject) => {
            const certData = fs.readFileSync(caminhoCRT);
            const keyData = fs.readFileSync(caminhoKey);

            const body = `grant_type=client_credentials&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}`;

            const options = {
                hostname: 'sts.itau.com.br',
                path: '/api/oauth/token',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(body),
                },
                cert: certData,
                key: keyData,
                rejectUnauthorized: false,
            };

            log('INFO', '=== DETALHES DA REQUISICAO HTTP (Token OAuth) ===');
            log('INFO', `URL: https://${options.hostname}${options.path}`);
            log('INFO', `Metodo: ${options.method}`);
            log('INFO', `Headers: Content-Type=${options.headers['Content-Type']}`);
            log('INFO', `Certificado mTLS: ${path.resolve(caminhoCRT)}`);
            log('INFO', `Chave mTLS: ${path.resolve(caminhoKey)}`);
            log('INFO', `Body: grant_type=client_credentials&client_id=${mascarar(clientId)}&client_secret=${mascarar(clientSecret)}`);
            log('INFO', `rejectUnauthorized: ${options.rejectUnauthorized}`);

            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    log('INFO', '=== DETALHES DA RESPOSTA HTTP (Token OAuth) ===');
                    log('INFO', `Status code: ${res.statusCode}`);
                    log('INFO', `Response headers: ${JSON.stringify(res.headers)}`);
                    log('INFO', `Response body (primeiros 500 chars): ${data.substring(0, 500)}`);

                    if (res.statusCode !== 200) {
                        const detalhe = detalharErroHttp(res.statusCode);
                        reject(new Error(`Erro ao obter token OAuth. Status: ${res.statusCode}\n  Possivel causa: ${detalhe}\n  Resposta do servidor: ${data.substring(0, 500)}`));
                        return;
                    }

                    resolve(data);
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Erro ao obter token OAuth: ${error.message}`));
            });

            req.write(body);
            req.end();
        });
    }

    static renovarCertificado(tokenSTS, caminhoCSR = 'ARQUIVO_REQUEST_CERTIFICADO.csr',
                               caminhoCRT = 'certificado.crt', caminhoCertMtls = '', caminhoKeyMtls = '') {
        return new Promise((resolve, reject) => {
            const conteudoCSR = fs.readFileSync(caminhoCSR, 'utf8');

            const crypto = require('crypto');
            const correlationId = crypto.randomUUID();

            const options = {
                hostname: 'sts.itau.com.br',
                path: '/seguranca/v2/certificado/renovacao',
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Authorization': `Bearer ${tokenSTS}`,
                    'x-itau-correlationID': correlationId,
                },
                rejectUnauthorized: false,
            };
            if (caminhoCertMtls && caminhoKeyMtls) {
                options.cert = fs.readFileSync(caminhoCertMtls);
                options.key = fs.readFileSync(caminhoKeyMtls);
                log('INFO', `mTLS cert: ${caminhoCertMtls}`);
                log('INFO', `mTLS key: ${caminhoKeyMtls}`);
            }

            log('INFO', '=== DETALHES DA REQUISICAO HTTP (Renovacao) ===');
            log('INFO', `URL: https://${options.hostname}${options.path}`);
            log('INFO', `Metodo: ${options.method}`);
            log('INFO', `Headers: Content-Type=${options.headers['Content-Type']}, Authorization=Bearer ${mascarar(tokenSTS)}, x-itau-correlationID=${correlationId}`);
            log('INFO', `Body (CSR): ${conteudoCSR.substring(0, 200)}${conteudoCSR.length > 200 ? '...' : ''}`);
            log('INFO', `Tamanho do body: ${conteudoCSR.length} bytes`);
            log('INFO', `rejectUnauthorized: ${options.rejectUnauthorized}`);
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    log('INFO', '=== DETALHES DA RESPOSTA HTTP (Renovacao) ===');
                    log('INFO', `Status code: ${res.statusCode}`);
                    log('INFO', `Response headers: ${JSON.stringify(res.headers)}`);
                    log('INFO', `Response body (primeiros 500 chars): ${data.substring(0, 500)}`);

                    if (res.statusCode !== 200) {
                        const detalhe = detalharErroHttp(res.statusCode);
                        reject(new Error(`Erro na renovacao do certificado. Status: ${res.statusCode}\n  Possivel causa: ${detalhe}\n  Resposta do servidor: ${data.substring(0, 500)}`));
                        return;
                    }

                    fs.writeFileSync(caminhoCRT, data);
                    console.log(`\nCertificado renovado salvo em ${path.resolve(caminhoCRT)}`);
                    resolve(data);
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Erro ao renovar certificado: ${error.message}`));
            });

            req.write(conteudoCSR);
            req.end();
        });
    }
}

function executarEtapa1(estado) {
    log('INFO', 'Inicio da Etapa 1: Gerar par de chaves e exibir chave publica');
    if (!fs.existsSync(PASTA_ETAPA1)) fs.mkdirSync(PASTA_ETAPA1, { recursive: true });
    console.log('\n[PASSO 1.1] Gerando par de chaves RSA 2048...');
    const caminhoPrivada = path.join(PASTA_ETAPA1, 'private.pem');
    const caminhoPublica = path.join(PASTA_ETAPA1, 'public.pem');
    CertificadoDinamico.gerarParDeChaves(caminhoPrivada, caminhoPublica);

    log('INFO', `Chave privada gerada: ${path.resolve(caminhoPrivada)}`);
    log('INFO', `Chave publica gerada: ${path.resolve(caminhoPublica)}`);

    console.log('\n[PASSO 1.2] Exibindo chave publica...');
    const conteudoChavePublica = fs.readFileSync(caminhoPublica, 'utf8');
    console.log('\n=============================================');
    console.log('  Chave Publica Gerada                       ');
    console.log('=============================================');
    console.log(conteudoChavePublica);

    estado.etapaConcluida = Math.max(estado.etapaConcluida || 0, 1);
    estado.caminhoChavePrivada = path.resolve(caminhoPrivada);
    estado.caminhoChavePublica = path.resolve(caminhoPublica);
    salvarEstado(estado);
    log('INFO', 'Etapa 1 concluida com sucesso');
    console.log('\n>> Etapa 1 concluida. Progresso salvo.');
    console.log('\n  O que fazer agora:');
    console.log('  1. Copie o conteudo da chave publica exibido acima');
    console.log('  2. Envie a chave publica para o Analista de operacoes Itau');
    console.log('  3. Aguarde o e-mail do Itau com as credenciais cifradas');
    console.log('  4. Quando receber o e-mail, execute a etapa 2');
}

async function executarEtapa2(estado, pergunta) {
    if ((estado.etapaConcluida || 0) < 1) {
        console.log('\n[AVISO] A etapa 1 (gerar chaves) precisa ser concluida antes.');
        log('WARN', 'Tentativa de executar Etapa 2 sem concluir Etapa 1');
        return;
    }

    log('INFO', 'Inicio da Etapa 2: Descriptografar credenciais, gerar e enviar certificado');
    if (!fs.existsSync(PASTA_ETAPA2)) fs.mkdirSync(PASTA_ETAPA2, { recursive: true });

    console.log('\n[PASSO 2.1] Descriptografar credenciais recebidas por e-mail...');
    const caminhoChavePrivada = path.resolve(estado.caminhoChavePrivada || 'private.pem');
    console.log(`  Chave privada: ${caminhoChavePrivada}`);
    log('INFO', `Chave privada utilizada: ${path.resolve(caminhoChavePrivada)}`);

    const clientIdCifrado = (await pergunta('Client ID cifrado: ')).trim();
    const tokenCifrado = (await pergunta('Token temporario cifrado: ')).trim();
    const chaveSessaoCifrada = (await pergunta('Chave de sessao cifrada: ')).trim();
    log('INFO', `Client ID cifrado: ${mascarar(clientIdCifrado)}`);
    log('INFO', `Token cifrado: ${mascarar(tokenCifrado)}`);
    log('INFO', `Chave de sessao cifrada: ${mascarar(chaveSessaoCifrada)}`);

    const { clientId, token: tokenDecifrado } = CertificadoDinamico.descriptografarCredenciais(
        clientIdCifrado, tokenCifrado, chaveSessaoCifrada, caminhoChavePrivada
    );

    const caminhoClientId = path.join(PASTA_ETAPA2, 'client_id.txt');
    fs.writeFileSync(caminhoClientId, clientId, 'utf8');
    console.log(`  Client ID salvo em ${path.resolve(caminhoClientId)}`);
    log('INFO', `Client ID decifrado: ${mascarar(clientId)}`);

    const caminhoToken = path.join(PASTA_ETAPA2, 'token_temporario.txt');
    fs.writeFileSync(caminhoToken, tokenDecifrado, 'utf8');
    console.log(`  Token temporario salvo em ${path.resolve(caminhoToken)}`);
    log('INFO', `Token decifrado: ${mascarar(tokenDecifrado)}`);

    console.log('\n[PASSO 2.2] Gerando CSR (Certificate Sign Request)...');
    console.log(`  Client ID: ${mascarar(clientId)}`);

    let organizacao = '';
    while (!organizacao) {
        organizacao = (await pergunta('Nome da Empresa: ')).trim();
        if (!organizacao) console.log('  Campo obrigatorio. Informe o nome da empresa.');
    }
    let cidade = '';
    while (!cidade) {
        cidade = (await pergunta('Cidade: ')).trim();
        if (!cidade) console.log('  Campo obrigatorio. Informe a cidade.');
    }
    let estadoUF = '';
    while (!estadoUF) {
        estadoUF = (await pergunta('Estado - UF: ')).trim();
        if (!estadoUF) console.log('  Campo obrigatorio. Informe o estado (UF).');
    }
    let pais = '';
    while (!pais) {
        pais = (await pergunta('Pais: ')).trim();
        if (!pais) console.log('  Campo obrigatorio. Informe o pais.');
    }
    log('INFO', `Client ID: ${mascarar(clientId)}`);
    log('INFO', `Organizacao: ${organizacao}, Cidade: ${cidade}, Estado: ${estadoUF}, Pais: ${pais}`);

    const caminhoCSR = path.join(PASTA_ETAPA2, 'ARQUIVO_REQUEST_CERTIFICADO.csr');
    const caminhoChaveCSR = path.join(PASTA_ETAPA2, 'ARQUIVO_CHAVE_PRIVADA.key');
    CertificadoDinamico.gerarCSR(clientId, organizacao, cidade, estadoUF, pais, caminhoCSR, caminhoChaveCSR);

    console.log('\n[PASSO 2.3] Enviando CSR ao STS Itau...');
    log('INFO', `Token: ${mascarar(tokenDecifrado)}`);
    log('INFO', `CSR: ${path.resolve(caminhoCSR)}`);
    log('INFO', 'Enviando requisicao para https://sts.itau.com.br/seguranca/v1/certificado/solicitacao');

    const caminhoCRT = path.join(PASTA_ETAPA2, 'certificado.crt');
    const secret = await CertificadoDinamico.enviarCertificado(tokenDecifrado, caminhoCSR, caminhoCRT);

    console.log('\n=============================================');
    console.log('  Certificado gerado com sucesso!            ');
    console.log('=============================================');
    console.log('Arquivos gerados:');
    console.log(`  - ${path.resolve(PASTA_ETAPA1, 'private.pem')} (chave privada para descriptografia)`);
    console.log(`  - ${path.resolve(PASTA_ETAPA1, 'public.pem')} (chave publica)`);
    console.log(`  - ${path.resolve(PASTA_ETAPA2, 'client_id.txt')} (Client ID)`);
    console.log(`  - ${path.resolve(PASTA_ETAPA2, 'ARQUIVO_CHAVE_PRIVADA.key')} (chave privada do certificado)`);
    console.log(`  - ${path.resolve(PASTA_ETAPA2, 'ARQUIVO_REQUEST_CERTIFICADO.csr')} (CSR)`);
    console.log(`  - ${path.resolve(PASTA_ETAPA2, 'certificado.crt')} (certificado assinado)`);
    console.log('\n==============================================');
    console.log('  ATENCAO - CLIENT SECRET                     ');
    console.log('==============================================');
    console.log('\nO Client Secret e equivalente a uma SENHA. Trate-o com o mesmo cuidado.');
    console.log('O valor do Client Secret sera exibido APENAS NESTE MOMENTO.');
    console.log('Copie e salve em um local seguro. Este valor NAO sera armazenado pelo programa.');
    console.log(`\n  Client Secret: ${secret}`);
    console.log('\n==============================================');
    console.log('Guarde essas informacoes em local seguro. O Client ID e o Client Secret sao equivalentes a senhas');
    console.log('e serao necessarios para gerar tokens OAuth e consumir as APIs do Itau.');
    console.log('NAO compartilhe essas credenciais. Quem tiver acesso a elas podera acessar as APIs em seu nome.');
    console.log('\nO Itau nao se responsabiliza pelo armazenamento local das credenciais.');
    console.log('A guarda correta e de responsabilidade exclusiva do cliente.');

    const expiracao = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const inicioRenovacao = new Date(expiracao.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fimRenovacao = new Date(expiracao.getTime() - 1 * 24 * 60 * 60 * 1000);
    const fmtData = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    console.log('\n===============================================');
    console.log('  VALIDADE DO CERTIFICADO                      ');
    console.log('===============================================');
    console.log('  Validade: 365 dias');
    console.log(`  Data de expiracao: ${fmtData(expiracao)}`);
    console.log(`  Periodo de renovacao: de ${fmtData(inicioRenovacao)} ate ${fmtData(fimRenovacao)}`);
    console.log('\n  O processo de renovacao (etapa 4) pode ser realizado a partir de');
    console.log('  30 dias antes da expiracao ate um dia antes da data de expiracao do certificado.');
    console.log('\n  ATENCAO: A responsabilidade de renovar o certificado dentro do prazo');
    console.log('  e exclusivamente sua. Certificados expirados impossibilitam o acesso');
    console.log('  as APIs do Itau e exigem a geracao de um novo certificado do zero.');

    estado.etapaConcluida = Math.max(estado.etapaConcluida || 0, 2);
    estado.caminhoClientId = path.resolve(caminhoClientId);
    estado.caminhoChavePrivada = caminhoChavePrivada;
    estado.caminhoCSR = path.resolve(caminhoCSR);
    estado.caminhoCRT = path.resolve(caminhoCRT);
    salvarEstado(estado);
    log('INFO', `Certificado salvo: ${path.resolve(caminhoCRT)}`);
    log('INFO', `Client Secret: ${mascarar(secret)}`);
    log('INFO', 'Etapa 2 concluida com sucesso');
    console.log('\n>> Etapa 2 concluida. Progresso salvo.');
    console.log('\n  O que fazer agora:');
    console.log('  1. Guarde o Client ID e o Client Secret em local seguro - eles sao equivalentes a SENHAS');
    console.log(`  2. O certificado (.crt) e a chave privada (.key) estao salvos na pasta ${path.resolve(PASTA_ETAPA2)}`);
    console.log('  3. Execute a etapa 3 para validar que tudo esta funcionando corretamente');
    console.log('  4. Apos validar, utilize o client_id, client_secret, certificado e chave privada na sua aplicacao');
    console.log('\n  LEMBRE-SE: Client ID, Client Secret, certificado e chave privada sao equivalentes a senhas.');
    console.log('  NAO compartilhe, NAO envie por e-mail e NAO deixe exposto em codigo-fonte.');
    console.log('  O Itau NAO se responsabiliza pelo armazenamento local. A guarda e responsabilidade exclusiva do cliente.');

    const respPfx2 = (await pergunta('\nDeseja gerar o arquivo PFX (PKCS#12)? O PFX combina o certificado e a chave privada em um unico arquivo protegido por senha. (s/N): ')).trim();
    if (respPfx2.toLowerCase() === 's') {
        const senhaPfx2 = (await pergunta('  Informe a senha para proteger o PFX: ')).trim();
        if (!senhaPfx2) {
            console.log('  Senha nao informada. PFX nao gerado.');
            log('WARN', 'PFX nao gerado - senha nao informada');
        } else {
            const caminhoPfx2 = path.join(PASTA_ETAPA2, 'certificado.pfx');
            const caminhoKeyPfx2 = path.resolve(PASTA_ETAPA2, 'ARQUIVO_CHAVE_PRIVADA.key');
            execSync(`openssl pkcs12 -export -out "${caminhoPfx2}" -inkey "${caminhoKeyPfx2}" -in "${caminhoCRT}" -passout pass:"${senhaPfx2}"`);
            console.log(`  PFX gerado: ${path.resolve(caminhoPfx2)}`);
            log('INFO', `PFX gerado: ${path.resolve(caminhoPfx2)}`);
        }
    }

    return secret;
}

async function executarEtapa3(estado, pergunta, clientSecretMemoria) {
    if ((estado.etapaConcluida || 0) < 2) {
        console.log('\n[AVISO] A etapa 2 (gerar e enviar certificado) precisa ser concluida antes.');
        log('WARN', 'Tentativa de executar Etapa 3 sem concluir Etapa 2');
        return;
    }

        log('INFO', 'Inicio da Etapa 3: Testar geracao de token');
        console.log('\n[PASSO 3] Testando geracao de token...');
    const caminhoClientId = estado.caminhoClientId || path.join(PASTA_ETAPA2, 'client_id.txt');
    if (!fs.existsSync(caminhoClientId)) {
        throw new Error(`Arquivo de client_id nao encontrado: ${caminhoClientId}. Execute as etapas anteriores.`);
    }
    const clientId = fs.readFileSync(caminhoClientId, 'utf8').trim();
    let clientSecret;
    if (clientSecretMemoria) {
        clientSecret = clientSecretMemoria;
        console.log(`  Client Secret: ${mascarar(clientSecret)} (obtido da sessao atual)`);
    } else {
        clientSecret = (await pergunta('  Informe o Client Secret: ')).trim();
    }
    const caminhoCRT = estado.caminhoCRT || path.join(PASTA_ETAPA2, 'certificado.crt');
    const caminhoKey = path.resolve(PASTA_ETAPA2, 'ARQUIVO_CHAVE_PRIVADA.key');

    if (!clientId || !clientSecret) {
        throw new Error('client_id ou client_secret nao informados. Verifique e tente novamente.');
    }

    console.log('\n  Arquivos utilizados na requisicao:');
    console.log(`  - ${path.resolve(caminhoClientId)} (Client ID: ${mascarar(clientId)})`);
    console.log(`  - ${path.resolve(caminhoCRT)} (certificado assinado)`);
    console.log(`  - ${path.resolve(caminhoKey)} (chave privada do certificado)`);

    const resposta = await CertificadoDinamico.obterTokenOAuth(clientId, clientSecret, caminhoCRT, caminhoKey);
    log('INFO', 'Token OAuth obtido com sucesso');
    log('INFO', 'Etapa 3 concluida com sucesso');

    let accessToken = '';
    try {
        const dados = JSON.parse(resposta);
        accessToken = dados.access_token || '';
    } catch (e) {}

    console.log('\n==============================================');
    console.log('  Credenciais e certificado VALIDADOS!        ');
    console.log('==============================================');
    console.log('\nAccess Token:');
    console.log(accessToken || resposta);
    console.log('\n  Validade: 300 segundos (5 minutos)');
    console.log('  Uso: Informe este token no header \'Authorization: Bearer <access_token>\' das requisicoes as APIs do Itau.');
    console.log('\nAs credenciais (client_id e client_secret) e o certificado digital estao validados e funcionais.');
    console.log('Voce ja pode utiliza-los em suas integracoes.');
    console.log('\n>> Etapa 3 concluida.');
    console.log('\n  O que fazer agora:');
    console.log('  1. Suas credenciais e certificado estao validados e prontos para uso');
    console.log('  2. Na sua aplicacao, implemente o fluxo OAuth usando:');
    console.log('     - Client ID e Client Secret (da etapa 2)');
    console.log(`     - Certificado .crt e chave privada .key (da pasta ${path.resolve(PASTA_ETAPA2)})`);
    console.log('  3. O token gerado tem validade de 5 minutos - sua aplicacao deve renova-lo periodicamente');
    console.log('  4. Lembre-se de renovar o certificado antes da data de expiracao (etapa 4)');
}

function exibirValidadeRenovacao(caminhoCRT) {
    const expiracaoRenov = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    const inicioRenov = new Date(expiracaoRenov.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fimRenov = new Date(expiracaoRenov.getTime() - 1 * 24 * 60 * 60 * 1000);
    const fmtDataRenov = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    console.log('\n===============================================');
    console.log('  VALIDADE DO CERTIFICADO RENOVADO             ');
    console.log('===============================================');
    console.log('  Validade: 365 dias');
    console.log(`  Data de expiracao: ${fmtDataRenov(expiracaoRenov)}`);
    console.log(`  Periodo de renovacao: de ${fmtDataRenov(inicioRenov)} ate ${fmtDataRenov(fimRenov)}`);
    console.log('\n  O processo de renovacao (etapa 4) pode ser realizado a partir de');
    console.log('  30 dias antes da expiracao ate um dia antes da data de expiracao do certificado.');
    console.log('\n  ATENCAO: A responsabilidade de renovar o certificado dentro do prazo');
    console.log('  e exclusivamente sua. Certificados expirados impossibilitam o acesso');
    console.log('  as APIs do Itau e exigem a geracao de um novo certificado do zero.');

    log('INFO', `Certificado renovado: ${path.resolve(caminhoCRT)}`);
    log('INFO', 'Etapa 4 concluida com sucesso');
    console.log('\n>> Etapa 4 concluida. Certificado renovado.');
}

async function oferecerPfxRenovacao(caminhoCRT, caminhoKey, pergunta) {
    const respPfx = (await pergunta('\nDeseja gerar o arquivo PFX (PKCS#12)? O PFX combina o certificado e a chave privada em um unico arquivo protegido por senha. (s/N): ')).trim();
    if (respPfx.toLowerCase() === 's') {
        const senhaPfx = (await pergunta('  Informe a senha para proteger o PFX: ')).trim();
        if (!senhaPfx) {
            console.log('  Senha nao informada. PFX nao gerado.');
            log('WARN', 'PFX nao gerado - senha nao informada');
        } else {
            const caminhoPfx = path.join(PASTA_ETAPA4, 'certificado.pfx');
            execSync(`openssl pkcs12 -export -out "${caminhoPfx}" -inkey "${caminhoKey}" -in "${caminhoCRT}" -passout pass:"${senhaPfx}"`);
            console.log(`  PFX gerado: ${path.resolve(caminhoPfx)}`);
            log('INFO', `PFX gerado: ${path.resolve(caminhoPfx)}`);
        }
    }
}

async function obterTokenRenovacao(estado, pergunta, clientSecretMemoria) {
    console.log('\n=============================================');
    console.log('  Como deseja obter o token para renovacao?  ');
    console.log('=============================================');
    console.log('  1. Automatico (via mTLS com certificado atual)');
    console.log('  2. Manual (informar token manualmente)');
    const opcaoToken = (await pergunta('\nEscolha (1 ou 2): ')).trim();

    if (opcaoToken === '1') {
        log('INFO', 'Obtencao de token automatica via mTLS');
        console.log('\n[PASSO 2.1] Obtendo token automaticamente via mTLS...');
        const caminhoClientIdPadrao = estado.caminhoClientId || path.join(PASTA_ETAPA2, 'client_id.txt');
        let clientId;
        if (fs.existsSync(caminhoClientIdPadrao)) {
            clientId = fs.readFileSync(caminhoClientIdPadrao, 'utf-8').trim();
            console.log(`  Client ID encontrado: ${mascarar(clientId)}`);
        } else if (estado.clientId) {
            clientId = estado.clientId;
            console.log(`  Client ID recuperado do estado salvo: ${mascarar(clientId)}`);
        } else {
            console.log(`  [AVISO] Arquivo de Client ID nao encontrado em: ${path.resolve(caminhoClientIdPadrao)}`);
            clientId = '';
            while (!clientId) {
                clientId = (await pergunta('  Informe o Client ID: ')).trim();
                if (!clientId) console.log('  Campo obrigatorio. Informe o Client ID.');
            }
        }
        let clientSecret;
        if (clientSecretMemoria) {
            clientSecret = clientSecretMemoria;
            console.log(`  Client Secret: ${mascarar(clientSecret)} (obtido da sessao atual)`);
        } else {
            clientSecret = '';
            while (!clientSecret) {
                clientSecret = (await pergunta('  Informe o Client Secret: ')).trim();
                if (!clientSecret) console.log('  Campo obrigatorio. Informe o Client Secret.');
            }
        }
        let caminhoCRT = estado.caminhoCRT || path.join(PASTA_ETAPA2, 'certificado.crt');
        if (!fs.existsSync(caminhoCRT)) {
            console.log(`  [AVISO] Certificado nao encontrado em: ${path.resolve(caminhoCRT)}`);
            caminhoCRT = '';
            while (!caminhoCRT || !fs.existsSync(caminhoCRT)) {
                caminhoCRT = (await pergunta('  Informe o caminho do certificado (.crt): ')).trim();
                if (!caminhoCRT || !fs.existsSync(caminhoCRT)) console.log(`  Arquivo nao encontrado: ${caminhoCRT}. Informe um caminho valido.`);
            }
        }
        console.log(`  Certificado: ${path.resolve(caminhoCRT)}`);
        let caminhoKey = path.resolve(PASTA_ETAPA2, 'ARQUIVO_CHAVE_PRIVADA.key');
        if (!fs.existsSync(caminhoKey)) {
            console.log(`  [AVISO] Chave privada nao encontrada em: ${caminhoKey}`);
            caminhoKey = '';
            while (!caminhoKey || !fs.existsSync(caminhoKey)) {
                caminhoKey = (await pergunta('  Informe o caminho da chave privada (.key): ')).trim();
                if (!caminhoKey || !fs.existsSync(caminhoKey)) console.log(`  Arquivo nao encontrado: ${caminhoKey}. Informe um caminho valido.`);
            }
        }
        console.log(`  Chave privada: ${path.resolve(caminhoKey)}`);
        const resposta = await CertificadoDinamico.obterTokenOAuth(clientId, clientSecret, caminhoCRT, caminhoKey);
        let tokenSTS = '';
        try {
            const dados = JSON.parse(resposta);
            tokenSTS = dados.access_token || '';
        } catch (e) {
            tokenSTS = resposta;
        }
        if (!tokenSTS) {
            throw new Error('Nao foi possivel obter o token automaticamente. Tente a opcao manual.');
        }
        console.log(`  Token obtido com sucesso: ${mascarar(tokenSTS)}`);
        log('INFO', `Token obtido automaticamente via mTLS: ${mascarar(tokenSTS)}`);
        return { token: tokenSTS, caminhoCRT, caminhoKey };
    } else {
        log('INFO', 'Obtencao de token manual');
        const tokenSTS = (await pergunta('Token STS para renovacao: ')).trim();
        if (!tokenSTS) throw new Error('Token STS e obrigatorio para renovacao do certificado.');
        console.log('\n  Para a requisicao de renovacao, e necessario o certificado e a chave privada (mTLS).');
        let caminhoCRT = estado.caminhoCRT || path.join(PASTA_ETAPA2, 'certificado.crt');
        if (!fs.existsSync(caminhoCRT)) {
            console.log(`  [AVISO] Certificado nao encontrado em: ${path.resolve(caminhoCRT)}`);
            caminhoCRT = '';
            while (!caminhoCRT || !fs.existsSync(caminhoCRT)) {
                caminhoCRT = (await pergunta('  Informe o caminho do certificado (.crt): ')).trim();
                if (!caminhoCRT || !fs.existsSync(caminhoCRT)) console.log(`  Arquivo nao encontrado: ${caminhoCRT}. Informe um caminho valido.`);
            }
        }
        console.log(`  Certificado: ${path.resolve(caminhoCRT)}`);
        let caminhoKey = path.resolve(PASTA_ETAPA2, 'ARQUIVO_CHAVE_PRIVADA.key');
        if (!fs.existsSync(caminhoKey)) {
            console.log(`  [AVISO] Chave privada nao encontrada em: ${caminhoKey}`);
            caminhoKey = '';
            while (!caminhoKey || !fs.existsSync(caminhoKey)) {
                caminhoKey = (await pergunta('  Informe o caminho da chave privada (.key): ')).trim();
                if (!caminhoKey || !fs.existsSync(caminhoKey)) console.log(`  Arquivo nao encontrado: ${caminhoKey}. Informe um caminho valido.`);
            }
        }
        console.log(`  Chave privada: ${path.resolve(caminhoKey)}`);
        return { token: tokenSTS, caminhoCRT, caminhoKey };
    }
}

async function executarEtapa4(estado, pergunta, clientSecretMemoria) {
    log('INFO', 'Inicio da Etapa 4: Renovar certificado');
    if (!fs.existsSync(PASTA_ETAPA4)) fs.mkdirSync(PASTA_ETAPA4, { recursive: true });

    const caminhoCRTValidacao = estado.caminhoCRT || path.join(PASTA_ETAPA2, 'certificado.crt');
    if (fs.existsSync(caminhoCRTValidacao)) {
        try {
            const certPem = fs.readFileSync(caminhoCRTValidacao, 'utf-8');
            const certDer = certPem.replace(/-----BEGIN CERTIFICATE-----/, '').replace(/-----END CERTIFICATE-----/, '').replace(/\s/g, '');
            const certBuffer = Buffer.from(certDer, 'base64');
            const x509Cert = new crypto.X509Certificate(certBuffer);
            const dataExpiracao = new Date(x509Cert.validTo);
            const agora = new Date();
            const diasRestantes = Math.floor((dataExpiracao.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));
            const fmtData = (d) => `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
            log('INFO', `Certificado encontrado: ${path.resolve(caminhoCRTValidacao)}`);
            log('INFO', `Data de expiracao: ${fmtData(dataExpiracao)} | Dias restantes: ${diasRestantes}`);
            console.log(`\n  Certificado encontrado: ${path.resolve(caminhoCRTValidacao)}`);
            console.log(`  Data de expiracao: ${fmtData(dataExpiracao)} (${diasRestantes} dias restantes)`);
            if (diasRestantes > 30) {
                console.log(`\n  [AVISO] O certificado ainda nao esta no periodo de renovacao.`);
                console.log(`  A renovacao e permitida nos ultimos 30 dias antes da expiracao.`);
                console.log(`  Faltam ${diasRestantes - 30} dias para o inicio do periodo de renovacao.`);
                log('WARN', `Certificado fora do periodo de renovacao. Dias restantes: ${diasRestantes}`);
                const prosseguir = (await pergunta('\n  Deseja prosseguir mesmo assim? (s/N): ')).trim().toLowerCase();
                if (prosseguir !== 's') {
                    console.log('  Renovacao cancelada pelo usuario.');
                    log('INFO', 'Renovacao cancelada pelo usuario - fora do periodo');
                    return;
                }
                log('INFO', 'Usuario optou por prosseguir com a renovacao fora do periodo');
            } else if (diasRestantes < 0) {
                console.log(`\n  [AVISO] O certificado ja esta EXPIRADO ha ${Math.abs(diasRestantes)} dias.`);
                log('WARN', `Certificado expirado ha ${Math.abs(diasRestantes)} dias`);
            } else {
                console.log('  Certificado dentro do periodo de renovacao.');
            }
        } catch (e) {
            log('WARN', `Nao foi possivel ler o certificado para validacao: ${e.message}`);
            console.log('\n  [AVISO] Nao foi possivel ler o certificado para validar a data de expiracao.');
            console.log('  Prosseguindo com a renovacao...');
        }
    } else {
        log('INFO', 'Certificado nao encontrado para validacao de periodo. Prosseguindo com a renovacao.');
        console.log(`\n  [INFO] Certificado nao encontrado em: ${path.resolve(caminhoCRTValidacao)}`);
        console.log('  Nao foi possivel validar o periodo de renovacao (30 dias antes da expiracao).');
        console.log('  Prosseguindo com a renovacao...');
    }

    console.log('\n=============================================');
    console.log('  Renovacao de Certificado - Escolha a opcao ');
    console.log('=============================================');
    console.log('\n  A. Renovacao completa (gera novo CSR e nova chave privada) - recomendada');
    console.log('     - Gera nova chave privada e novo CSR antes de renovar');
    console.log('     - Recomendado para maior seguranca ou quando a chave pode ter sido comprometida');
    console.log('\n  B. Renovacao simples (reutiliza o CSR existente)');
    console.log('     - Mais rapido, mantem a mesma chave privada do certificado');
    console.log('     - Recomendado quando nao ha necessidade de trocar a chave');

    const opcao = (await pergunta('\nEscolha a opcao (A ou B): ')).trim().toUpperCase();
    if (opcao !== 'A' && opcao !== 'B') {
        console.log('Opcao invalida. Escolha A ou B.');
        return;
    }

    if (opcao === 'A') {
        log('INFO', 'Opcao A: Renovacao completa (novo CSR e nova chave privada)');
        console.log('\n[PASSO 1] Gerando nova chave privada e novo CSR...');
        const caminhoClientId = estado.caminhoClientId || path.join(PASTA_ETAPA2, 'client_id.txt');
        let clientId;
        if (fs.existsSync(caminhoClientId)) {
            clientId = fs.readFileSync(caminhoClientId, 'utf-8').trim();
        } else if (estado.clientId) {
            clientId = estado.clientId;
            console.log('  Client ID recuperado do estado salvo.');
        } else {
            console.log('  Nao foi possivel recuperar o Client ID automaticamente.');
            console.log('  Informe o Client ID manualmente para continuar.');
            clientId = '';
            while (!clientId) {
                clientId = (await pergunta('Client ID: ')).trim();
                if (!clientId) console.log('  Campo obrigatorio. Informe o Client ID.');
            }
        }
        console.log(`  Client ID: ${mascarar(clientId)}`);

        let organizacao = '';
        while (!organizacao) {
            organizacao = (await pergunta('Nome da Empresa: ')).trim();
            if (!organizacao) console.log('  Campo obrigatorio. Informe o nome da empresa.');
        }
        let cidade = '';
        while (!cidade) {
            cidade = (await pergunta('Cidade: ')).trim();
            if (!cidade) console.log('  Campo obrigatorio. Informe a cidade.');
        }
        let estadoUF = '';
        while (!estadoUF) {
            estadoUF = (await pergunta('Estado - UF: ')).trim();
            if (!estadoUF) console.log('  Campo obrigatorio. Informe o estado (UF).');
        }
        let pais = '';
        while (!pais) {
            pais = (await pergunta('Pais: ')).trim();
            if (!pais) console.log('  Campo obrigatorio. Informe o pais.');
        }

        const caminhoCSR = path.join(PASTA_ETAPA4, 'ARQUIVO_REQUEST_CERTIFICADO.csr');
        const caminhoChaveCSR = path.join(PASTA_ETAPA4, 'ARQUIVO_CHAVE_PRIVADA.key');
        CertificadoDinamico.gerarCSR(clientId, organizacao, cidade, estadoUF, pais, caminhoCSR, caminhoChaveCSR);
        log('INFO', `Novo CSR gerado: ${path.resolve(caminhoCSR)}`);
        log('INFO', `Nova chave privada gerada: ${path.resolve(caminhoChaveCSR)}`);

        console.log('\n[PASSO 2] Obtendo token para renovacao...');
        const resultadoToken = await obterTokenRenovacao(estado, pergunta, clientSecretMemoria);
        const tokenSTS = resultadoToken.token;
        const caminhoCertMtls = resultadoToken.caminhoCRT;
        const caminhoKeyMtls = resultadoToken.caminhoKey;

        console.log('\n[PASSO 3] Enviando novo CSR para renovacao...');
        const caminhoCRT = path.join(PASTA_ETAPA4, 'certificado.crt');
        log('INFO', `Token STS: ${mascarar(tokenSTS)}`);
        log('INFO', `CSR: ${path.resolve(caminhoCSR)}`);
        log('INFO', 'Enviando requisicao para https://sts.itau.com.br/seguranca/v2/certificado/renovacao');
        await CertificadoDinamico.renovarCertificado(tokenSTS, caminhoCSR, caminhoCRT, caminhoCertMtls, caminhoKeyMtls);

        exibirValidadeRenovacao(caminhoCRT);
        console.log('\n  O que fazer agora:');
        console.log(`  1. O novo certificado esta salvo na pasta ${path.resolve(PASTA_ETAPA4)}`);
        console.log('  2. Substitua o certificado antigo E a chave privada pelos novos na sua aplicacao');
        console.log(`  3. A nova chave privada (.key) esta em ${path.resolve(caminhoChaveCSR)}`);
        console.log('  4. Teste a geracao de token (etapa 3) para confirmar que o novo certificado esta funcionando');

        await oferecerPfxRenovacao(caminhoCRT, path.resolve(caminhoChaveCSR), pergunta);

    } else {
        log('INFO', 'Opcao B: Renovacao simples (reutiliza CSR existente)');
        console.log('\n[PASSO 1] Localizando CSR existente...');
        let caminhoCSR = estado.caminhoCSR || '';
        if (!caminhoCSR || !fs.existsSync(caminhoCSR)) {
            const caminhoCSRPadrao = path.resolve(PASTA_ETAPA2, 'ARQUIVO_REQUEST_CERTIFICADO.csr');
            if (fs.existsSync(caminhoCSRPadrao)) {
                caminhoCSR = caminhoCSRPadrao;
            } else {
                caminhoCSR = (await pergunta('Caminho do arquivo CSR: ')).trim();
                if (!caminhoCSR || !fs.existsSync(caminhoCSR)) throw new Error(`Arquivo CSR nao encontrado: ${caminhoCSR}`);
            }
        }
        console.log(`  CSR encontrado: ${path.resolve(caminhoCSR)}`);

        console.log('\n[PASSO 2] Obtendo token para renovacao...');
        const resultadoTokenB = await obterTokenRenovacao(estado, pergunta, clientSecretMemoria);
        const tokenSTS = resultadoTokenB.token;
        const caminhoCertMtlsB = resultadoTokenB.caminhoCRT;
        const caminhoKeyMtlsB = resultadoTokenB.caminhoKey;

        console.log('\n[PASSO 3] Enviando CSR para renovacao...');
        const caminhoCRT = path.join(PASTA_ETAPA4, 'certificado.crt');
        log('INFO', `Token STS: ${mascarar(tokenSTS)}`);
        log('INFO', `CSR: ${path.resolve(caminhoCSR)}`);
        log('INFO', 'Enviando requisicao para https://sts.itau.com.br/seguranca/v2/certificado/renovacao');
        await CertificadoDinamico.renovarCertificado(tokenSTS, caminhoCSR, caminhoCRT, caminhoCertMtlsB, caminhoKeyMtlsB);

        exibirValidadeRenovacao(caminhoCRT);
        console.log('\n  O que fazer agora:');
        console.log(`  1. O novo certificado esta salvo na pasta ${path.resolve(PASTA_ETAPA4)}`);
        console.log('  2. Substitua o certificado antigo pelo novo na sua aplicacao');
        console.log('  3. A chave privada (.key) da etapa 2 continua sendo a mesma - nao muda na renovacao');
        console.log('  4. Teste a geracao de token (etapa 3) para confirmar que o novo certificado esta funcionando');

        const caminhoKeyPfx = path.resolve(PASTA_ETAPA2, 'ARQUIVO_CHAVE_PRIVADA.key');
        await oferecerPfxRenovacao(caminhoCRT, caminhoKeyPfx, pergunta);
    }
}

function statusEtapa(n, etapaConcluida) {
    if (n <= etapaConcluida) return '[CONCLUIDA]';
    if (n === etapaConcluida + 1) return '[PROXIMA >>] <------ voce esta aqui';
    return '[PENDENTE]';
}

function exibirMenu(estado) {
    const etapaConcluida = estado.etapaConcluida || 0;

    console.log('\n=============================================');
    console.log('  Certificado Dinamico Itau - Menu Principal ');
    console.log('=============================================');
    console.log(`\n  Progresso atual: Etapa ${etapaConcluida} de 3 concluida(s)\n`);

    console.log(`  1. ${ETAPAS[1]} ${statusEtapa(1, etapaConcluida)}`);

    console.log(`  2. ${ETAPAS[2]} ${statusEtapa(2, etapaConcluida)}`);

    console.log(`  3. ${ETAPAS[3]} ${statusEtapa(3, etapaConcluida)}`);

    console.log('  4. Renovar certificado');

    console.log('\n  0. Sair');
    console.log('  9. Recomecar do zero (limpa progresso)');

    return etapaConcluida + 1 <= 3 ? etapaConcluida + 1 : 3;
}

async function main() {
    const arquivoLog = configurarLog();
    log('INFO', 'Programa iniciado');
    console.log(`  Log desta execucao: ${arquivoLog}`);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const pergunta = (texto) => new Promise((resolve) => rl.question(texto, resolve));

    try {
        let estado = carregarEstado();
        let clientSecretMemoria = '';
        while (true) {
            const proxima = exibirMenu(estado);

            const escolhaStr = (await pergunta(`\nEscolha a etapa (padrao: ${proxima}): `)).trim();
            const escolha = escolhaStr === '' ? proxima : parseInt(escolhaStr);
            log('INFO', `Opcao escolhida pelo usuario: ${escolha}`);

            if (escolha === 0) {
                log('INFO', 'Programa encerrado pelo usuario');
                console.log('\nSaindo. Seu progresso foi salvo.');
                break;
            } else if (escolha === 9) {
                log('INFO', 'Limpeza de progresso e arquivos gerados iniciada');
                for (const pasta of [PASTA_ETAPA1, PASTA_ETAPA2, PASTA_ETAPA4]) {
                    if (fs.existsSync(pasta)) {
                        for (const arquivo of fs.readdirSync(pasta)) {
                            const caminhoArquivo = path.join(pasta, arquivo);
                            if (fs.statSync(caminhoArquivo).isFile()) {
                                fs.unlinkSync(caminhoArquivo);
                            }
                        }
                        console.log(`  Arquivos removidos da pasta: ${path.resolve(pasta)}`);
                        log('INFO', `Arquivos removidos da pasta: ${path.resolve(pasta)}`);
                    }
                }
                if (fs.existsSync(ARQUIVO_ESTADO)) {
                    fs.unlinkSync(ARQUIVO_ESTADO);
                    console.log(`  Removido: ${path.resolve(ARQUIVO_ESTADO)}`);
                    log('INFO', `Removido: ${path.resolve(ARQUIVO_ESTADO)}`);
                }
                console.log('\nProgresso e arquivos gerados removidos.');
                log('INFO', 'Limpeza concluida');
                estado = {};
                clientSecretMemoria = '';
                continue;
            } else if (isNaN(escolha)) {
                console.log('Opcao invalida.');
                continue;
            }

            try {
                if (escolha === 1) {
                    executarEtapa1(estado);
                } else if (escolha === 2) {
                    const secret = await executarEtapa2(estado, pergunta);
                    if (secret) clientSecretMemoria = secret;
                } else if (escolha === 3) {
                    await executarEtapa3(estado, pergunta, clientSecretMemoria);
                } else if (escolha === 4) {
                    await executarEtapa4(estado, pergunta, clientSecretMemoria);
                } else {
                    console.log('Opcao invalida.');
                    continue;
                }
            } catch (error) {
                log('ERROR', `${error.name}: ${error.message}`);
                log('WARN', 'Etapa NAO foi marcada como concluida devido ao erro');
                console.log(`\n[ERRO] ${error.name}: ${error.message}`);
                console.log('A etapa NAO foi marcada como concluida. Verifique o erro acima e tente novamente. Caso persista entre em contato com o suporte.');
            }

            await pergunta('\nPressione ENTER para voltar ao menu...');
        }
    } finally {
        if (logStream) logStream.end();
        rl.close();
    }
}

main();*/