import { Module } from '@nestjs/common';
import { LoadImageService } from './load_image.service';
import { LoadImageController } from './load_image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Image, ImageSchema } from './schema/load_image.schema';
import { MulterModule } from '@nestjs/platform-express';
import { PATH_RAIZ_IMAGE } from 'src/StringValues';
import { AppService } from 'src/app.service';

@Module({
  imports: [MongooseModule.forFeature([
    {name: Image.name, schema: ImageSchema}
  ]),
    MulterModule.register({
      dest: PATH_RAIZ_IMAGE,
    })],
  providers: [LoadImageService, AppService],
  controllers: [LoadImageController]
})
export class LoadImageModule {}
