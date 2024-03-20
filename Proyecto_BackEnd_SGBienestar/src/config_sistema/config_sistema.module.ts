import { Module } from '@nestjs/common';
import { ConfigSistemaService } from './config_sistema.service';
import { ConfigSistemaController } from './config_sistema.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigSistema, ConfigSistemaSchema } from './schema/config_sistema.schema';

@Module({
  imports:[MongooseModule.forFeature([{
    name: ConfigSistema.name,
    schema: ConfigSistemaSchema
  }])],
  providers: [ConfigSistemaService],
  controllers: [ConfigSistemaController]
})
export class ConfigSistemaModule {}
