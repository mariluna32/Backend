import { Module } from '@nestjs/common';
import { JornadaService } from './jornada.service';
import { JornadaController } from './jornada.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Jornada, JornadaModel } from './schema/jornada.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Jornada.name,
        schema: JornadaModel,
      },
    ]),
  ],
  controllers: [JornadaController],
  providers: [JornadaService],
})
export class JornadaModule {}
