import { Module } from '@nestjs/common';
import { NivelFormacionController } from './nivel-formacion.controller';
import { NivelFormacionService } from './nivel-formacion.service';
import { MongooseModule } from '@nestjs/mongoose';
import { NivelFormacion, NivelFormacionSchema } from './schema/nivel-formacion.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name: NivelFormacion.name,
    schema: NivelFormacionSchema
  }])
],
  controllers: [NivelFormacionController],
  providers: [NivelFormacionService]
})
export class NivelFormacionModule {}
