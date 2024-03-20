import { HttpException,HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/create-categoria.dto';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { InjectModel } from '@nestjs/mongoose';
import { Categoria } from './schema/categoria.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectModel(Categoria.name) private categoriaModel: Model<Categoria>
  ) {}

  async create(CreateCategoriaDto: CreateCategoriaDto) {
    const found = await this.categoriaModel.findOne({ nombre: CreateCategoriaDto.nombre});
    if (found) {
      throw new HttpException(MENSAJES_ERROR.CATEGORIA_EXISTE, HttpStatus.CONFLICT);
    }
    
    const newRol = new this.categoriaModel(CreateCategoriaDto);
    await newRol.save();
    throw new HttpException(MENSAJES_OK.CATEGORIA_CREADA, HttpStatus.ACCEPTED)
  }
  findAll() {
    return this.categoriaModel.find();
  }

  async findOneById(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.categoriaModel.findOne({ _id: objId });

      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.CATEGORIA_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      return found;
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_CATEGORIA_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  async update(id: string, Categoria: UpdateCategoriaDto){
    try {
        const objId = new Types.ObjectId(id);
        const found = await this.categoriaModel.findOne({_id: objId});
        if(!found){            
            throw new HttpException(MENSAJES_ERROR.CATEGORIA_NO_EXISTE, HttpStatus.NOT_FOUND);
        }
        await this.categoriaModel.findByIdAndUpdate(id, Categoria, {new:true});
        return new HttpException(MENSAJES_OK.CATEGORIA_ACTUALIZADA, HttpStatus.ACCEPTED);
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_CATEGORIA_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
}

  async remove(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.categoriaModel.findOne({ _id: objId });
      if (!found) {
        throw new HttpException(
          MENSAJES_ERROR.CATEGORIA_NO_EXISTE,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.categoriaModel.findByIdAndDelete(id);
      return new HttpException(MENSAJES_OK.CATEGORIA_ELIMINADA, HttpStatus.ACCEPTED);
    } catch (error) {
      throw new HttpException(
        MENSAJES_ERROR.ID_CATEGORIA_NO_VALIDO,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}  



 