import { Module } from '@nestjs/common';
import { EstadoImplementoController } from './estado-implemento.controller';
import { EstadoImplementoService } from './estado-implemento.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadoImplementos, EstadoImplementosSchema } from './schema/estado-implemento.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name: EstadoImplementos.name, // Especificar nombre a la coleccion
    schema: EstadoImplementosSchema // Especificar el esquema de datos
  }])
  ],
  controllers: [EstadoImplementoController],
  providers: [EstadoImplementoService]
})
export class EstadoImplementoModule {}
