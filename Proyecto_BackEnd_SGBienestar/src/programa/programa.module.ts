import { Module } from '@nestjs/common';
import { ProgramaController } from './programa.controller';
import { ProgramaService } from './programa.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Programa, ProgramaSchema } from './schema/programa.schema';
import { NivelFormacion, NivelFormacionSchema } from 'src/nivel-formacion/schema/nivel-formacion.schema';

@Module({
  imports:[MongooseModule.forFeature([
    {
    name: Programa.name,
    schema: ProgramaSchema
    },
    {
      name: NivelFormacion.name,
      schema: NivelFormacionSchema
    }
])
],
  controllers: [ProgramaController],
  providers: [ProgramaService]
})
export class ProgramaModule {}
