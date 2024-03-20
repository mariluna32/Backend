/*eslint-disable */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Rol } from './schema/rol.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { RolDto, UpdateRolDtO } from './dto/rol.dto';
@Injectable()
export class RolService {
  constructor(@InjectModel(Rol.name) private rolModel: Model<Rol>) {}

  findAll() {
    return this.rolModel.find();
  }

  async findOneById(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.rolModel.findOne({ _id: objId });

      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.ROL_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      return found;
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_ROL_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async create(rol: RolDto) {
    const found = await this.rolModel.findOne({
      $or: [{ nombre: rol.nombre }, { privilegio: rol.privilegio }],
    });
    if (found) {
      throw new HttpException(MENSAJES_ERROR.ROL_EXISTE, HttpStatus.CONFLICT);
    }
    const newRol = new this.rolModel(rol);
    await newRol.save();
    throw new HttpException(MENSAJES_OK.ROL_CREADO, HttpStatus.ACCEPTED)
  }

  async delete(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.rolModel.findOne({ _id: objId });
      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.ROL_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.rolModel.findByIdAndDelete(id);
      return new HttpException(MENSAJES_OK.ROL_ELIMINADO, HttpStatus.ACCEPTED);
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_ROL_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
  async update(id: string, rol: UpdateRolDtO){
    try {
        const objId = new Types.ObjectId(id);
        const found = await this.rolModel.findOne({_id: objId});
        if(!found){            
            throw new HttpException(MENSAJES_ERROR.ROL_NO_EXISTE, HttpStatus.NOT_FOUND);
        }
        await this.rolModel.findByIdAndUpdate(id, rol, {new:true});
        return new HttpException(MENSAJES_OK.ROL_ACTUALIZADO, HttpStatus.ACCEPTED);
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_ROL_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
}
}
