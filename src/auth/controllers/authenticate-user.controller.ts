import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNumber, IsString, IsStrongPassword } from 'class-validator';
import { AuthService } from '../auth.service';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/roles.enum';

export class AuthenticateUserDTO {
  @IsString()
  login: string;

  @IsString()
  @IsStrongPassword({})
  password: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;

}

@Roles(Role.PUBLIC)
@Controller('/login')
export class AuthenticateUserController {
  constructor(private authService: AuthService) { }

  @Post()
  @HttpCode(200)
  async handle(@Body() data: AuthenticateUserDTO) {

    const { login, password, empresaId } = data;
    const result = await this.authService.authenticateUser(login, password, empresaId);
    return {
      access_token: result,
    };
  }
}
