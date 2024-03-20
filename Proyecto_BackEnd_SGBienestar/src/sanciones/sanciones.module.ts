import { Module } from '@nestjs/common';
import { SancionesService } from './sanciones.service';
import { SancionesController } from './sanciones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioSchema, Usuarios } from 'src/registro/schemas/registro.schema';
import { Sancion, sancionesSchema} from './schema/sanciones.schema';
import { Mails, mailSchema } from 'src/mail/schema/mail.schema';
import { MailService } from 'src/mail/mail.service';
import { RegistroService } from 'src/registro/registro.service';
import { Rol, RolSchema } from 'src/rol/schema/rol.schema';
import { Comentarios, comentariosSchema } from 'src/mail/schema/comentarios.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Sancion.name,
      schema: sancionesSchema
    }]),
    MongooseModule.forFeature([{
      name: Usuarios.name,
      schema: UsuarioSchema
    }]),MongooseModule.forFeature([{
      name: Mails.name, 
      schema: mailSchema 
    }]),
    MongooseModule.forFeature([{
      name: Rol.name, 
      schema: RolSchema 
    }]),
    MongooseModule.forFeature([{
      name: Comentarios.name, 
      schema: comentariosSchema 
    }])
  ],
  controllers: [SancionesController],
  providers: [SancionesService,MailService,RegistroService],
})
export class SancionesModule {}