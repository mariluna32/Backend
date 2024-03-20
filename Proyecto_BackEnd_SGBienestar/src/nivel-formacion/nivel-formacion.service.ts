import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NivelFormacion } from './schema/nivel-formacion.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { CreateNivelDTO, UpdateNivelDTO } from './dto/nivel-formacion.dto';

@Injectable()
export class NivelFormacionService {
    constructor(@InjectModel(NivelFormacion.name) private nivelModel: Model<NivelFormacion>) {}

    findAll(){
        return this.nivelModel.find();
    }

    async findOneById(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.nivelModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.NIVEL_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            return found;
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_NIVEL_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }        
    }

    async create(nivel: CreateNivelDTO){
        const found = await this.nivelModel.findOne({nombre: nivel.nombre});
        if(found){
            throw new HttpException(MENSAJES_ERROR.NIVEL_EXISTE, HttpStatus.CONFLICT);
        }
        const newRegistro = new this.nivelModel(nivel);
        await newRegistro.save();        
        throw new HttpException(MENSAJES_OK.NIVEL_CREADO, HttpStatus.ACCEPTED);
    }

    async delete(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.nivelModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.NIVEL_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.nivelModel.findByIdAndDelete(id);
            return new HttpException(MENSAJES_OK.NIVEL_ELIMINADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_NIVEL_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    async update(id: string, nivel: UpdateNivelDTO){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.nivelModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.NIVEL_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.nivelModel.findByIdAndUpdate(id, nivel, {new:true});
            return new HttpException(MENSAJES_OK.NIVEL_ACTUALIZADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_NIVEL_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
