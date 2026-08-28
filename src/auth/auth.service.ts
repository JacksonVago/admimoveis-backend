// auth.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BoletoStatus } from '@prisma/client';
import { compare } from 'bcryptjs';
import { UserPayload } from './estrategies/jwt.strategy';

//IMPROVE: create errors enum with all possible errors messages for consistency

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) { }

  async validateUser(login: string, password: string, empresaId: number): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        empresaId_login: {
          login,
          empresaId,
        }
      },
    });

    if (user && user.password === password) {
      const { password, ...result } = user; //remove password from user object
      return result;
    }

    return null;
  }

  // async login(user: any) {
  //   const payload = { email: user.email, sub: user.id, roles: user.role };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  async authenticateUser(login: string, password: string, empresaId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        empresaId_login: {
          login,
          empresaId,
        }
      },
      include: {
        empresa: {
          include: {
            empresaAssinaturas: true,
          }
        }
      }
    });

    //console.log('Authenticating user:', user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    else if (!user.empresa) {
      throw new UnauthorizedException('Empresa not found for the user');
    }
    else if (!user.empresa.empresaAssinaturas || user.empresa.empresaAssinaturas.length === 0) {
      throw new UnauthorizedException('Empresa does not have an active subscription');
    }
    else if (user.empresa.empresaAssinaturas[0].status === BoletoStatus.PENDENTE) {
      throw new UnauthorizedException('Acesso negado. Assinatura pendente. Entre em contato com o suporte.');
    }


    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: UserPayload = { id: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }
}
