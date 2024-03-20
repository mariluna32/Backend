import { Module } from '@nestjs/common';
import { RolController } from './rol.controller';
import { RolService } from './rol.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Rol, RolSchema } from './schema/rol.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Rol.name,
        schema: RolSchema,
      },
    ]),
  ],
  controllers: [RolController],
  providers: [RolService],
})
export class RolModule {}
