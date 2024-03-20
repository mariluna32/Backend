import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateImageDto } from './dto/load_image.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Image } from './schema/load_image.schema';
import { Model, Types } from 'mongoose';
import { MulterFile } from 'multer';
import { PATH_RAIZ } from 'src/StringValues';
import * as fs from 'fs';
import { AppService } from 'src/app.service';

@Injectable()
export class LoadImageService {
    constructor(@InjectModel(Image.name) private imageModel: Model<Image>,
                @Inject(AppService)private appService: AppService) {}

    async uploadImage(createImageDto: CreateImageDto, files: MulterFile[]){
      const uploadedImages = [];
      for (const file of files) {
        const { originalname, fieldname, destination, mimetype, size } = file;
        const path = require('path');
        let fileN = originalname;
        try {
          fileN = createImageDto.filename.length > 0
            ? createImageDto.filename + '.' + originalname.split('.')[1]
            : originalname;
        } catch (error) {}        
        const filePath = path.join(PATH_RAIZ + '/upload/image', fileN);
        fs.renameSync(file.path, filePath);
        const address = process.env.HOST;
        const newImage = new this.imageModel({
          filename: fileN,
          path: destination + '/' + fileN,
          src: address + 'src/image/' + fileN,
          size: size,
        });
        const savedImage = await newImage.save();
        uploadedImages.push(savedImage);
      }
      return uploadedImages;
    }
    
    async getAllImages(){
      return await this.imageModel.find().exec();
    }

    async getImageById(id: string){
      try {
        const objId = new Types.ObjectId(id);
        return await this.imageModel.findById(objId);
      } catch (error) {
        return;
      }      
    }

    async renameImage(id: string, createImageDto: CreateImageDto){
      try {
        const path = require('path');
        const objId = new Types.ObjectId(id);
        const filePath = path.join(PATH_RAIZ + '/upload/image', createImageDto.filename);
        const image = await this.imageModel.findByIdAndUpdate(objId, {
          filename: createImageDto.filename,
          path: filePath
        });
        if(!image){
          return;
        }
        fs.renameSync(image.path, filePath);
        return "Se renombro la imagen";
      } catch (error) {
        return 'Error al renombrar la imagen ' + error;
      }
    }

    async deleteImage(id: string){
      try {
        const objId = new Types.ObjectId(id);
        const image = await this.imageModel.findByIdAndDelete(objId);
        if(!image){
          return;
        }
        fs.unlinkSync(image.path);
        console.log('image: ', image);
        return 'Imagen Eliminada';
      } catch (error) {
        return 'Error al eliminar la imagen';
      }
    }

    /*async getServerAddress(){
      const server = this.httpServer.getHttpServer();
      const address = server.address();

      if (typeof address === 'string') {
        return address;
      } else if (address && typeof address === 'object' && 'port' in address) {
        const host = address.address === '::' ? 'localhost' : address.address;
        const port = address.port;
        return `http://${host}:${port}`;
      }

    }*/
    
}
