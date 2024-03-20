import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TipoInforme } from './schema/tipo-informe.schema';
import { Model, Types } from 'mongoose';
import { CreateTipoInformeDTO, UpdateTipoInformeDTO } from './dto/tipo-informe.dto';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';

@Injectable()
export class TipoInformeService {
    constructor(@InjectModel(TipoInforme.name) private readonly tipoInformeModel: Model<TipoInforme>) {}

    async create(createTipoInformeDto: CreateTipoInformeDTO) {
        const newSancion = new this.tipoInformeModel(createTipoInformeDto);
        await newSancion.save();
        throw new HttpException(MENSAJES_OK.TIPO_INFORME_CREADO, HttpStatus.ACCEPTED);
    }

    findAll() {
        return this.tipoInformeModel.find();
    }

    async getNumero(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.tipoInformeModel.find({ _id: objId }); 
            if (!found) {
                throw new HttpException(MENSAJES_ERROR.TIPO_INFORME_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            let numInforme = "";
            let strSplit = found[0].nombre.split(' ');
            strSplit.forEach((word)=>{
                if(word != 'de'){
                    numInforme += word.substring(0, 1);
                }
            });
            
            if(found[0].numero < 10){
                numInforme += "000" + found[0].numero;
            }else if(found[0].numero < 100){
                numInforme += "00" + found[0].numero;
            }else if(found[0].numero < 1000){
                numInforme += "0" + found[0].numero;
            }else{
                numInforme += found[0].numero;
            }
            return numInforme;
            } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_TIPO_INFORME_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    async update(id: string, tipoInforme: UpdateTipoInformeDTO) {
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.tipoInformeModel.findOne({ _id: objId });
            if (!found) {
            throw new HttpException(MENSAJES_ERROR.TIPO_INFORME_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.tipoInformeModel.findByIdAndUpdate(id, tipoInforme, { new: true });
            return new HttpException(MENSAJES_OK.TIPO_INFORME_ACTUALIZADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_TIPO_INFORME_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    async delete(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.tipoInformeModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.TIPO_INFORME_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.tipoInformeModel.findByIdAndDelete(id);
            return new HttpException(MENSAJES_OK.TIPO_INFORME_ELIMINADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_TIPO_INFORME_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }    
}
