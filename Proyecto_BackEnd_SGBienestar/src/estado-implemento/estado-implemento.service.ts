import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EstadoImplementos } from './schema/estado-implemento.schema';
import { Model, Types } from 'mongoose';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { CreateEstadoImplementoDTO, UpdateEstadoImplementoDTO } from './dto/estado-implemento.dto';
import { promises } from 'dns';

@Injectable()
export class EstadoImplementoService {
    constructor(@InjectModel(EstadoImplementos.name) private estadoImplementoModel: Model<EstadoImplementos>){}

    findAll(){
        return this.estadoImplementoModel.find();
    }

    async findOneById(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.estadoImplementoModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.ESTADO_IMPLEMENTO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            return found;
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_ESTADO_IMPLEMENTO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }        
    }

    async findImplementosByEstado(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.estadoImplementoModel.find({_id: objId}).populate('implementos');
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.ID_ESTADO_IMPLEMENTO_NO_VALIDO, HttpStatus.NOT_FOUND);
            }
            return found;
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_ESTADO_IMPLEMENTO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }        
    }

    async create(estadoImplemento: CreateEstadoImplementoDTO): Promise<HttpException>{
        try {
            const newEstadoImplemento = await new this.estadoImplementoModel(estadoImplemento)
            .save();
            return new HttpException(MENSAJES_OK.ESTADO_IMPLEMENTO_CREADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ESTADO_IMPLEMENTO_EXISTE, HttpStatus.BAD_REQUEST);
        }  
    }

    async update(id: string, estadoImplemento?: UpdateEstadoImplementoDTO): Promise<HttpException>{
        try {
            const objId = new Types.ObjectId(id);
            await this.estadoImplementoModel.findByIdAndUpdate(objId, estadoImplemento, {new:true});
            return new HttpException(MENSAJES_OK.ESTADO_IMPLEMENTO_ACTUALIZADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_ESTADO_IMPLEMENTO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }
    /*async update(id: string, estadoImplemento?: UpdateEstadoImplementoDTO, idImplemento?: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.estadoImplementoModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.ESTADO_IMPLEMENTO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            if(idImplemento != ""){
                estadoImplemento = new UpdateEstadoImplementoDTO();
                found.implementos.push(idImplemento);
                estadoImplemento.implementos = found.implementos;
            }            
            await this.estadoImplementoModel.findByIdAndUpdate(id, estadoImplemento, {new:true});
            return new HttpException(MENSAJES_OK.ESTADO_IMPLEMENTO_ACTUALIZADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_ESTADO_IMPLEMENTO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }*/

    async delete(id: string): Promise<HttpException>{
        try {
            const objId = new Types.ObjectId(id);
            await this.estadoImplementoModel.findByIdAndDelete(objId);
            return new HttpException(MENSAJES_OK.ESTADO_IMPLEMENTO_ELIMINADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_ESTADO_IMPLEMENTO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
