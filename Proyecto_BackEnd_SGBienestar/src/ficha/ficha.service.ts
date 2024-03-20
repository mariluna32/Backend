import { HttpException, HttpStatus, Injectable, UploadedFile } from '@nestjs/common';
import { CreateFichaDto, UpdateFichaDto } from './dto/create-ficha.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Ficha } from './schemas/ficha.schema';
import { Model, Types } from 'mongoose';
import * as xlsx from 'xlsx'
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { Programa } from 'src/programa/schema/programa.schema';


@Injectable()
export class FichaService {
  constructor(@InjectModel(Ficha.name) private fichaModel: Model<Ficha>,
             @InjectModel(Programa.name) private programaModel: Model<Programa>) {}

  async upload(@UploadedFile() fileBuffer: Buffer) {
  
    try {
      const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(sheet);
      const idPrograma = await this.programaModel.find()
      for (const item of jsonData) {
        
        if (item["__EMPTY_9"] !== undefined) {
          const programaEncontrado = idPrograma.find(programa => programa.codigo === item["__EMPTY_3"])
          if(programaEncontrado){
         
          const nuevo = new this.fichaModel({
            "codigo": item["__EMPTY_10"],
            "programa": programaEncontrado._id,
            "fecha_inicio": item["__EMPTY_11"],
            "fecha_fin": item["__EMPTY_12"]
          });
          await nuevo.save();
            }
          }
      }
      } catch (error) {
        throw new HttpException(MENSAJES_ERROR.FICHA_NO_SUBIDA, HttpStatus.CONFLICT) 
      }
    }

    
  async create(ficha: CreateFichaDto) {
    const found = await this.fichaModel.findOne({
      $or: [{ nombre: ficha.codigo }, { privilegio: ficha.jornada },{ privilegio: ficha.programa }],
    });
    if (found) {
      throw new HttpException(MENSAJES_ERROR.FICHA_EXISTE, HttpStatus.CONFLICT);
    }
    const newRol = new this.fichaModel(ficha);
    await newRol.save();
  }

  findAll() {
    return this.fichaModel.find().populate({
        path: 'programa',
        populate:{
          path: 'nivel'
        }
      });
  }

  async findOneById(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.fichaModel.findOne({ _id: objId });

      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.FICHA_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      return found;
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_FICHA_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async findOneByCode(codigo: string) {
    try {
      const found = await this.fichaModel.findOne({ codigo: codigo })
      .populate({
        path: 'programa',
        populate:{
          path: 'nivel'
        }
      });

      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.FICHA_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      return found;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        MENSAJES_ERROR.ID_FICHA_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  

  async update(id: string, ficha: UpdateFichaDto){
    try {
        const objId = new Types.ObjectId(id);
        const found = await this.fichaModel.findOne({_id: objId});
        if(!found){            
            throw new HttpException(MENSAJES_ERROR.FICHA_NO_EXISTE, HttpStatus.NOT_FOUND);
        }
        await this.fichaModel.findByIdAndUpdate(id, ficha, {new:true});
        return new HttpException(MENSAJES_OK.FICHA_ACTUALIZADA, HttpStatus.ACCEPTED);
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_FICHA_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
}

  async delete(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.fichaModel.findOne({ _id: objId });
      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.FICHA_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.fichaModel.findByIdAndDelete(id);
      return new HttpException(MENSAJES_OK.FICHA_ELIMINADA, HttpStatus.ACCEPTED);
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_FICHA_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
