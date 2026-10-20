import { Controller, Get } from "@nestjs/common";
import { classeExemplo } from "./classeExemplo";

@Controller('exemplo')
export class controllerExemplo {
    constructor(private readonly meuServico: classeExemplo) {
    }

    @Get()
    async entrada() {
        console.log('versão:', this.meuServico.getNada());
        return "Olá!!"
    }
}
