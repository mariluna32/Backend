import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { CreateDominioSenaDto, UpdateDominioSenaDto } from './dto/create-dominio-sena.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Dominio } from './schema/dom.schema';
import { Model, Types } from 'mongoose';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';

@Injectable()
export class DominioSenaService {
  constructor(@InjectModel(Dominio.name) private domModel: Model<Dominio>){}

 async create(createDominioSenaDto: CreateDominioSenaDto) {
    const found = await this.domModel.findOne({
      $or: [{ nombre: createDominioSenaDto.nombre }],
    });
    if (found) {
      throw new HttpException(MENSAJES_ERROR.DOMINIO_EXISTE, HttpStatus.CONFLICT);
    }
    const newRol = new this.domModel(createDominioSenaDto);
    await newRol.save();
  }

  findAll() {
    return this.domModel.find();
  }

  async findOne(id: number) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.domModel.findOne({ _id: objId });

      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.DOMINIO_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      return found;
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_DOMINIO_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async update(id: string, dominio: UpdateDominioSenaDto){
    try {
        const objId = new Types.ObjectId(id);
        const found = await this.domModel.findOne({_id: objId});
        if(!found){            
            throw new HttpException(MENSAJES_ERROR.DOMINIO_NO_EXISTE, HttpStatus.NOT_FOUND);
        }
        await this.domModel.findByIdAndUpdate(id, dominio, {new:true});
        return new HttpException(MENSAJES_OK.DOMINIO_ACTUALIZADO, HttpStatus.ACCEPTED);
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_DOMINIO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
}


  remove(id: number) {
    return `This action removes a #${id} dominioSena`;
  }
}
