import { Module } from '@nestjs/common';
import { EstadoPrestamoController } from './estado-prestamo.controller';
import { EstadoPrestamoService } from './estado-prestamo.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadoPrestamo, EstadoPrestamoSchema } from './schema/estado-prestamo.schema';

@Module({imports: [
  MongooseModule.forFeature([{
      name: EstadoPrestamo.name,
      schema: EstadoPrestamoSchema
    }])
  ],
  controllers: [EstadoPrestamoController],
  providers: [EstadoPrestamoService]
})
export class EstadoPrestamoModule {}
