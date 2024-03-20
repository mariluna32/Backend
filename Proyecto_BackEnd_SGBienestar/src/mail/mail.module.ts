/* eslint-disable */
import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { RegistroService } from 'src/registro/registro.service';
import { RolService } from 'src/rol/rol.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema, Usuarios } from 'src/registro/schemas/registro.schema';
import { Rol, RolSchema } from 'src/rol/schema/rol.schema';
import { Mails, mailSchema } from './schema/mail.schema';
import { Comentarios, comentariosSchema } from './schema/comentarios.schema';

@Module({
  imports:[/*[MongooseModule.forFeature([{
    name: Usuarios.name, 
    schema: UsuarioSchema 
  }]),MongooseModule.forFeature([{
    name: Rol.name, 
    schema: RolSchema 
  }]),*/MongooseModule.forFeature([{
    name: Mails.name, 
    schema: mailSchema 
  }]),MongooseModule.forFeature([{
    name: Comentarios.name, 
    schema: comentariosSchema 
  }]),MongooseModule.forFeature([{
    name: Usuarios.name, 
    schema: UsuarioSchema 
  }])
 
],
  controllers: [MailController],
  providers: [MailService/*,RegistroService,RolService*/]
})
export class MailModule {}
