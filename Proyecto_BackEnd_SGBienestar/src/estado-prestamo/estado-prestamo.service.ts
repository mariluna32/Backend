import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EstadoPrestamo } from './schema/estado-prestamo.schema';
import { Model, Types } from 'mongoose';
import { CreateEstadoPrestamoDTO, UpdateEstadoPrestamoDTO } from './dto/estado-prestamo.dto';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';

@Injectable()
export class EstadoPrestamoService {
    constructor(@InjectModel(EstadoPrestamo.name) private readonly estadoPrestamoModel: Model<EstadoPrestamo>) {}

    async create(createTipoInformeDto: CreateEstadoPrestamoDTO) {
        const newSancion = new this.estadoPrestamoModel(createTipoInformeDto);
        await newSancion.save();
        throw new HttpException(MENSAJES_OK.ESTADO_PRESTAMO_CREADO, HttpStatus.ACCEPTED);
    }

    async findAll() {
        return await this.estadoPrestamoModel.find();
    }

    async findOneById(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.estadoPrestamoModel.findOne({ _id: objId }); 
            if (!found) {
                throw new HttpException(MENSAJES_ERROR.ESTADO_PRESTAMO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            return found;
            } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_ESTADO_PRESTAMO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    async update(id: string, estadoPrestamo: UpdateEstadoPrestamoDTO) {
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.estadoPrestamoModel.findOne({ _id: objId });
            if (!found) {
            throw new HttpException(MENSAJES_ERROR.ESTADO_PRESTAMO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.estadoPrestamoModel.findByIdAndUpdate(id, estadoPrestamo, { new: true });
            return new HttpException(MENSAJES_OK.ESTADO_PRESTAMO_ACTUALIZADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_ESTADO_PRESTAMO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    async delete(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.estadoPrestamoModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.ESTADO_PRESTAMO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.estadoPrestamoModel.findByIdAndDelete(id);
            return new HttpException(MENSAJES_OK.ESTADO_PRESTAMO_ELIMINADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_ESTADO_PRESTAMO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    } 
}
