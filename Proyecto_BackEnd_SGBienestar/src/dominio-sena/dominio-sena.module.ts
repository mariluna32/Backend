import { Module } from '@nestjs/common';
import { DominioSenaService } from './dominio-sena.service';
import { DominioSenaController } from './dominio-sena.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Dominio, DominioSchema } from './schema/dom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Dominio.name,
        schema: DominioSchema,
      },
    ]),
  ],
  controllers: [DominioSenaController],
  providers: [DominioSenaService],
})
export class DominioSenaModule {}
