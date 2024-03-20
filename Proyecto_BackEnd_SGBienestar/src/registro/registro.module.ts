import { Module } from '@nestjs/common';
import { RegistroController } from './registro.controller';
import { RegistroService } from './registro.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuarios, UsuarioSchema } from 'src/registro/schemas/registro.schema';
import { MailService } from 'src/mail/mail.service';
import { Rol, RolSchema } from 'src/rol/schema/rol.schema';
import { RolService } from 'src/rol/rol.service';
import { Mails, mailSchema } from 'src/mail/schema/mail.schema';
import { Comentarios, comentariosSchema } from 'src/mail/schema/comentarios.schema';
import { Sancion, sancionesSchema } from 'src/sanciones/schema/sanciones.schema';

@Module({
  imports:[MongooseModule.forFeature([{
      name: Usuarios.name, // Especificar nombre a la coleccion
      schema: UsuarioSchema // Especificar el esquema de datos
    }]),MongooseModule.forFeature([{
      name: Rol.name, 
      schema: RolSchema 
    }]),MongooseModule.forFeature([{
      name: Mails.name, 
      schema: mailSchema 
    }]),
    MongooseModule.forFeature([{
      name: Comentarios.name, 
      schema: comentariosSchema 
    }]),
    MongooseModule.forFeature([{
      name: Sancion.name, 
      schema: sancionesSchema
    }])
  ],
  controllers: [RegistroController],
  providers: [RegistroService, MailService, RolService]
})
export class RegistroModule {
  
}
