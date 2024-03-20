import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Jornada } from './schema/jornada.schema';
import { Model, Types } from 'mongoose';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';

@Injectable()
export class JornadaService {
  constructor(@InjectModel(Jornada.name) private jornadaModel: Model<Jornada>) {}
  async create(jornada: CreateJornadaDto ) {
    const found = await this.jornadaModel.findOne({
      $or: [{ nombre: jornada.nombre }],
    });
    if (found) {
      throw new HttpException(MENSAJES_ERROR.JORNADA_EXISTE, HttpStatus.CONFLICT);
    }
    const newRol = new this.jornadaModel(jornada);
    await newRol.save();
  }

  findAll() {
    return this.jornadaModel.find();
  }

  async findOneById(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.jornadaModel.findOne({ _id: objId });

      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.JORNADA_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      return found;
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_JORNADA_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async update(id: string, jornada: UpdateJornadaDto){
    try {
        const objId = new Types.ObjectId(id);
        const found = await this.jornadaModel.findOne({_id: objId});
        if(!found){            
            throw new HttpException(MENSAJES_ERROR.JORNADA_NO_EXISTE, HttpStatus.NOT_FOUND);
        }
        await this.jornadaModel.findByIdAndUpdate(id, jornada, {new:true});
        return new HttpException(MENSAJES_OK.JORNADA_ACTUALIZADA, HttpStatus.ACCEPTED);
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_JORNADA_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
}

  async delete(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.jornadaModel.findOne({ _id: objId });
      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.JORNADA_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.jornadaModel.findByIdAndDelete(id);
      return new HttpException(MENSAJES_OK.JORNADA_ELIMINADA, HttpStatus.ACCEPTED);
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_JORNADA_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
