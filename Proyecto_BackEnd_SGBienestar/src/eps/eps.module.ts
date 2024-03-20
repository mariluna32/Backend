import { Module } from '@nestjs/common';
import { EpsService } from './eps.service';
import { EpsController } from './eps.controller';
import { EpsSchema, eps } from './schema/eps.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: eps.name,
        schema: EpsSchema,
      },
    ]),
  ],
  controllers: [EpsController],
  providers: [EpsService],
})
export class EpsModule {}
