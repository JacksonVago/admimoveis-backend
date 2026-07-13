import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  // Caminho para os seus arquivos de certificado SSL
  const keyPath = path.resolve(__dirname, '../ssl/server.key');
  const certPath = path.resolve(__dirname, '../ssl/WWW_adminimovel_com_br.crt');

  // Lê os arquivos de forma síncrona
  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  app.enableCors();
  //enable validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  //IMPROVE: separete that to a different file, create a admin user
  // try {
  //   const userService = app.get(UsersService);
  //   const adminEmail = configService.get('ADMIN_EMAIL');
  //   const adminPassword = configService.get('ADMIN_PASSWORD');
  //   const adminName = configService.get('ADMIN_NAME');
  //   await userService.createAdminUser(adminName, adminEmail, adminPassword);
  // } catch (error) {
  //   console.error('Error creating admin user', error);
  // }

  await app.listen(port);

}

bootstrap();
