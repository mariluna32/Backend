import { Module } from '@nestjs/common';
import { InformeController } from './informe.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoInforme, TipoInformeSchema } from 'src/tipo-informe/schema/tipo-informe.schema';
import { UsuarioSchema, Usuarios } from 'src/registro/schemas/registro.schema';
import { Implemento, ImplementosSchema } from 'src/implementos/schema/implementos.schema';
import { Sancion, sancionesSchema } from 'src/sanciones/schema/sanciones.schema';
import { TipoInformeService } from 'src/tipo-informe/tipo-informe.service';
import { Informe, InformeSchema } from './schema/informe.schema';
import { InformeService } from './informe.service';

@Module({
  imports: [MongooseModule.forFeature([
    {name: TipoInforme.name,schema: TipoInformeSchema},
    {name: Usuarios.name,schema: UsuarioSchema},
    {name: Implemento.name,schema: ImplementosSchema},
    {name: Sancion.name,schema: sancionesSchema},
    {name: Informe.name,schema: InformeSchema}
  ])  
],
  controllers: [InformeController],
  providers: [InformeService, TipoInformeService]
})
export class InformeModule {}
