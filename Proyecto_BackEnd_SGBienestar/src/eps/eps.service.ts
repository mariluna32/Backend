import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEpDto, UpdateEpsDto } from './dto/create-ep.dto';
import { InjectModel } from '@nestjs/mongoose';
import { eps } from './schema/eps.schema';
import { Model, Types } from 'mongoose';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';

@Injectable()
export class EpsService {
  constructor(@InjectModel(eps.name) private epsModel: Model<eps>){}

  async create(epsD: CreateEpDto) {
    const found = await this.epsModel.findOne({ nombre: epsD.nombre });
    if (found) {
      throw new HttpException(MENSAJES_ERROR.EPS_EXISTE, HttpStatus.CONFLICT);
    }
    const newRol = new this.epsModel(epsD);
    await newRol.save();
  }

  findAll() {
    return this.epsModel.find();
  }
  
  async findOne(id: number) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.epsModel.findOne({ _id: objId });

      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.EPS_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      return found;
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_EPS_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async remove(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.epsModel.findOne({ _id: objId });
      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.EPS_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.epsModel.findByIdAndDelete(id);
      return new HttpException(MENSAJES_OK.EPS_ELEIMINADO, HttpStatus.ACCEPTED);
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_EPS_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async update(id:string, eps: UpdateEpsDto){
    try{
      const objId = new Types.ObjectId(id)
      const found = await this.epsModel.findOne({_id: objId})
      if(!found){
        throw new HttpException(MENSAJES_ERROR.EPS_NO_EXISTE, HttpStatus.NOT_FOUND)
      }
      await this.epsModel.findByIdAndUpdate(id, eps, {new:true});
      return new HttpException(MENSAJES_OK.EPS_ACTUALIZAD, HttpStatus.ACCEPTED)
    } catch(error){
      
    }
  }
}
