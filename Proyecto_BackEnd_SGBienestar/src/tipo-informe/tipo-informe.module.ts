import { Module } from '@nestjs/common';
import { TipoInformeController } from './tipo-informe.controller';
import { TipoInformeService } from './tipo-informe.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TipoInforme, TipoInformeSchema } from './schema/tipo-informe.schema';

@Module({imports: [
  MongooseModule.forFeature([{
      name: TipoInforme.name,
      schema: TipoInformeSchema
    }])
  ],
  controllers: [TipoInformeController],
  providers: [TipoInformeService]
})
export class TipoInformeModule {}
