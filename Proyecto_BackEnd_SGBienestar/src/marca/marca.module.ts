import { Module } from '@nestjs/common';
import { MarcaService } from './marca.service';
import { MarcaController } from './marca.controller';
import { MarcaSchema, Marca } from './schema/marca.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Marca.name,
        schema: MarcaSchema,
      },
    ]),
  ],
  controllers: [MarcaController],
  providers: [MarcaService],
})
export class MarcaModule {}
