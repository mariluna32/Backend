import { Module, forwardRef } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { PrestamosController } from './prestamos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Prestamos, prestamoSchema } from './schema/prestamos.schema';
import { Implemento, ImplementosSchema } from 'src/implementos/schema/implementos.schema';
import { QuinceMinService } from './quincemin.service';
import { MailService } from 'src/mail/mail.service';
import { Mails, mailSchema } from 'src/mail/schema/mail.schema';
import { Comentarios, comentariosSchema } from 'src/mail/schema/comentarios.schema';
import { SancionesService } from 'src/sanciones/sanciones.service';
import { SancionesModule } from 'src/sanciones/sanciones.module';
import { RegistroService } from 'src/registro/registro.service';
import { Sancion, sancionesSchema } from 'src/sanciones/schema/sanciones.schema';
import { RegistroModule } from 'src/registro/registro.module';
import { MailModule } from 'src/mail/mail.module';
import { UsuarioSchema, Usuarios } from 'src/registro/schemas/registro.schema';
import { Rol, RolSchema } from 'src/rol/schema/rol.schema';
import { TemporizacionService } from './temporizacion.service';
import { ConfigSistema, ConfigSistemaSchema } from 'src/config_sistema/schema/config_sistema.schema';
import { ConfigSistemaService } from 'src/config_sistema/config_sistema.service';

@Module({
  imports: [MongooseModule.forFeature([{
    name: Prestamos.name,
    schema: prestamoSchema
  }]), MongooseModule.forFeature([{
    name: Implemento.name,
    schema: ImplementosSchema
  }]), MongooseModule.forFeature([{
    name: Mails.name,
    schema: mailSchema
  }]), MongooseModule.forFeature([{
    name: Comentarios.name,
    schema: comentariosSchema
  }]), MongooseModule.forFeature([{
    name: Sancion.name,
    schema: sancionesSchema
  }]), MongooseModule.forFeature([{
    name: Usuarios.name,
    schema: UsuarioSchema
  }]), MongooseModule.forFeature([{
    name: Rol.name, 
    schema: RolSchema
  }]), MongooseModule.forFeature([{
    name: ConfigSistema.name, 
    schema: ConfigSistemaSchema
  }])],
  controllers: [PrestamosController],
  providers: [PrestamosService, QuinceMinService, TemporizacionService, SancionesService, MailService, RegistroService, ConfigSistemaService],
})
export class PrestamosModule {}
