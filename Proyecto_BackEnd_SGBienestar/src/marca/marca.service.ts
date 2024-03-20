import { HttpException,HttpStatus, Injectable } from '@nestjs/common';
import { CreateMarcaDto, UpdateMarcaDto } from './dto/create-marca.dto';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Marca } from './schema/marca.schema';

@Injectable()
export class MarcaService {
  constructor(
    @InjectModel(Marca.name) private marcaModel: Model<Marca>
  ) {}

  async create(MarcaD: CreateMarcaDto) {
    const found = await this.marcaModel.findOne({ nombre: MarcaD.nombre});
    if (found) {
      throw new HttpException(MENSAJES_ERROR.MARCA_EXISTE, HttpStatus.CONFLICT);
    }

    const newRol = new this.marcaModel(MarcaD);
    await newRol.save();
    throw new HttpException(MENSAJES_OK.MARCA_CREADA, HttpStatus.ACCEPTED);
  }
  findAll() {
    return this.marcaModel.find();
  }

  async findOneById(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.marcaModel.findOne({ _id: objId });

      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.MARCA_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      return found;
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_MARCA_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async update(id: string, Marca: UpdateMarcaDto){
    try {
        const objId = new Types.ObjectId(id);
        const found = await this.marcaModel.findOne({_id: objId});
        if(!found){            
            throw new HttpException(MENSAJES_ERROR.MARCA_NO_EXISTE, HttpStatus.NOT_FOUND);
        }
        await this.marcaModel.findByIdAndUpdate(id, Marca, {new:true});
        return new HttpException(MENSAJES_OK.MARCA_ACTUALIZADA, HttpStatus.ACCEPTED);
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_MARCA_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
  }
  async remove(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.marcaModel.findOne({ _id: objId});
      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.MARCA_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.marcaModel.findByIdAndDelete(id);
      return new HttpException(MENSAJES_OK.MARCA_ELIMINADA, HttpStatus.ACCEPTED)
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_MARCA_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}