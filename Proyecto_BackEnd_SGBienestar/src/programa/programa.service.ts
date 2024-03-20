import { HttpException, HttpStatus, Injectable, UploadedFile } from '@nestjs/common';
import { Programa } from './schema/programa.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as xlsx from 'xlsx'
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { CreateProgramaDTO, UpdateProgramaDTO } from './dto/programa.dto';
import { NivelFormacion } from 'src/nivel-formacion/schema/nivel-formacion.schema';

@Injectable()
export class ProgramaService {
    constructor(@InjectModel(Programa.name) private programaModel: Model<Programa>,@InjectModel(NivelFormacion.name) private nivelFormacionModel: Model<NivelFormacion>) {}

    findAll(){
        return this.programaModel.find();
    }

    async findOneById(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.programaModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.PROGRAMA_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            return found;
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_PROGRAMA_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }        
    }

    async create(programa: CreateProgramaDTO){
        const found = await this.programaModel.findOne({$and:[
            {codigo: programa.codigo},
            {version: programa.version},
            {nombre: programa.nombre},
            {nivel: programa.nivel}
        ]});
        if(found){
            throw new HttpException(MENSAJES_ERROR.PROGRAMA_EXISTE, HttpStatus.CONFLICT);
        }
        const newRegistro = new this.programaModel(programa);
        await newRegistro.save();
        throw new HttpException(MENSAJES_OK.PROGRAMA_CREADO, HttpStatus.ACCEPTED);
    }

    async upload(@UploadedFile() fileBuffer: Buffer){
        try{
            const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(sheet);
            const idNivel = await this.nivelFormacionModel.find()
            
            for(const item of jsonData){
                const nivelencontrado = idNivel.find(id => id.nombre === item["__EMPTY_6"])
                if(item["__EMPTY_3"] != undefined && 
                item["__EMPTY_4"] != undefined && 
                item["__EMPTY_5"] != undefined && 
                item["__EMPTY_6"] != undefined && 
                item["__EMPTY_4"] != "VERSION_PROGRAMA" && 
                item["__EMPTY_5"] != "PROGRAMA"){
                  const nuevo = new this.programaModel({
                    "codigo": item["__EMPTY_3"],
                    "version": item["__EMPTY_4"],
                    "nombre": item["__EMPTY_5"],
                    "nivel": nivelencontrado._id
                  })
                  await nuevo.save()
            }
        }
        } catch (error){
            throw new HttpException(MENSAJES_ERROR.PROGRAMA_NO_SUBIDO, HttpStatus.CONFLICT)
        }
    }




    async delete(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.programaModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.PROGRAMA_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.programaModel.findByIdAndDelete(id);
            return new HttpException(MENSAJES_OK.PROGRAMA_ELIMINADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_PROGRAMA_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    async update(id: string, programa: UpdateProgramaDTO){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.programaModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.PROGRAMA_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.programaModel.findByIdAndUpdate(id, programa, {new:true});
            return new HttpException(MENSAJES_OK.PROGRAMA_ACTUALIZADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_PROGRAMA_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }
}
