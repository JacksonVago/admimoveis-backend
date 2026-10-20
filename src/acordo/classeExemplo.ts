
export class classeExemplo {
    private versao: string = '1.01';

    private pegaVersao() {
        this.versao = "1.201";
        return this.versao;
    }

    async devolveVersao() {
        return this.pegaVersao();
    }

    async getRegistros(id: number, status: string) {
        return `achei o registro id: ${id} e status:${status}`;
    }

    async getNada() {

    }
}
