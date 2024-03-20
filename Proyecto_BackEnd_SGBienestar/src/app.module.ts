import { Module } from '@nestjs/common';
import { RegistroModule } from './registro/registro.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from './mail/mail.module';
import { RolModule } from './rol/rol.module';
import { NivelFormacionModule } from './nivel-formacion/nivel-formacion.module';
import { ProgramaModule } from './programa/programa.module';
import { EpsModule } from './eps/eps.module';
import { DominioSenaModule } from './dominio-sena/dominio-sena.module';
import { JornadaModule } from './jornada/jornada.module';
import { FichaModule } from './ficha/ficha.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImplementosModule } from './implementos/implementos.module';
import { EstadoImplementoModule } from './estado-implemento/estado-implemento.module';
import { MarcaModule } from './marca/marca.module';
import { CategoriaModule } from './categoria/categoria.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { SancionesModule } from './sanciones/sanciones.module';
import { AppController } from './app.controller';
import { TipoInformeModule } from './tipo-informe/tipo-informe.module';
import { EstadoPrestamoModule } from './estado-prestamo/estado-prestamo.module';
import { InformeModule } from './informe/informe.module';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoadImageModule } from './load_image/load_image.module';
import { AppService } from './app.service';
import { ConfigSistemaModule } from './config_sistema/config_sistema.module';

@Module({
  imports: [
    MongooseModule.forRoot("mongodb+srv://ps2712267:Yn4r2w40YKbsyKm9@cluster0.glxptiy.mongodb.net/SGBienestarDB", {
      dbName: "SGBienestarDB",
      serverSelectionTimeoutMS: 5000
    }),
    MulterModule.register({
      dest: './uploads' , 
    }),
    ScheduleModule.forRoot(),
    RegistroModule,
    MailModule,
    RolModule,
    NivelFormacionModule,
    ProgramaModule,
    EpsModule,
    DominioSenaModule,
    JornadaModule,
    FichaModule,
    ImplementosModule,
    EstadoImplementoModule,
    MarcaModule,
    CategoriaModule,
    PrestamosModule,
    SancionesModule,
    TipoInformeModule,
    EstadoPrestamoModule,
    InformeModule,
    NotificacionesModule,
    LoadImageModule,
    ConfigSistemaModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

