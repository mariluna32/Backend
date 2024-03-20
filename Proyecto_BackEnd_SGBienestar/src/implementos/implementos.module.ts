import { Module } from '@nestjs/common';
import { ImplementosController } from './implementos.controller';
import { ImplementosService } from './implementos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Implemento, ImplementosSchema } from './schema/implementos.schema';
import { EstadoImplementoService } from 'src/estado-implemento/estado-implemento.service';
import { EstadoImplementos, EstadoImplementosSchema } from 'src/estado-implemento/schema/estado-implemento.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name: Implemento.name, // Especificar nombre a la coleccion
    schema: ImplementosSchema // Especificar el esquema de datos
  },
  {
    name: EstadoImplementos.name, // Especificar nombre a la coleccion
    schema: EstadoImplementosSchema // Especificar el esquema de datos
  }])
  ],
  controllers: [ImplementosController],
  providers: [ImplementosService, EstadoImplementoService]
})
export class ImplementosModule {}
