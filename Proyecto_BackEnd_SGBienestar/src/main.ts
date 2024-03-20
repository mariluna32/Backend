import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { PATH_RAIZ_IMAGE } from './StringValues';
import { AppService } from './app.service';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); 
  
  const corsOptions: CorsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  app.enableCors(corsOptions);

  const config = new DocumentBuilder()
    .setTitle('SGBienestar SENA - CCIT')
    .setDescription('Sistema de Gestion Bienestar al Aprendiz SENA - CCIT')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.use('/src/image', express.static(PATH_RAIZ_IMAGE));

  const server = await app.listen(3000);

  const serverAddress = server.address() as { address: string, family: string, port: number };
  serverAddress.address = serverAddress.address === '::' ? 'localhost' : serverAddress.address;
  const isHttps = server instanceof Object && 'key' in server && 'cert' in server;
  const protocol = isHttps ? 'https' : 'http';

  const serverAddressService = app.get(AppService);
  serverAddressService.setServerAddress(serverAddress);
  serverAddressService.setServerLinkAddress(`${protocol}://${serverAddress.address}${(serverAddress.port !== null) ? ':' : ''}${serverAddress.port}`)

  //console.log(`Servidor iniciado en ${protocol}://${serverAddress.address}${(serverAddress.port !== null) ? ':' : ''}${serverAddress.port}`);

}
bootstrap();
