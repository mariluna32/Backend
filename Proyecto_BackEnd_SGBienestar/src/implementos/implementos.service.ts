import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Implemento } from './schema/implementos.schema';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { CreateImplementoDTO, UpdateImplementoDTO } from './dto/implementos.dto';
import { EstadoImplementos } from 'src/estado-implemento/schema/estado-implemento.schema';
import { EstadoImplementoService } from 'src/estado-implemento/estado-implemento.service';

@Injectable()
export class ImplementosService {
    constructor(@InjectModel(Implemento.name) private implementoModel: Model<Implemento>,
                @InjectModel(EstadoImplementos.name) private estadoImplementoModel: Model<EstadoImplementos>,
                @Inject(EstadoImplementoService) readonly estadoImplementoService: EstadoImplementoService){}

    findAll(){
        return this.implementoModel.find()
            .populate('marca')
            .populate('categoria')
            .populate('estado.estado');
    }

    async findOneById(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.implementoModel.findOne({_id: objId})
                .populate('marca')
                .populate('categoria')
                .populate('estado.estado');
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            return found;
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.IMPLEMENTO_NO_EXISTE, HttpStatus.NOT_ACCEPTABLE);
        }        
    }

    async findByCategoria(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.implementoModel.find({categoria: objId})
                .populate('marca')
                .populate('categoria')
                .populate('estado.estado');
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.ID_CATEGORIA_NO_VALIDO, HttpStatus.NOT_FOUND);
            }
            return found;
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_CATEGORIA_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }        
    }

    async findByEstado(ids: string){
        try {
            const idsplit = ids.split(',');
            const elemMatchs = idsplit.map((estadoId) => ({
                estado: {$elemMatch: {estado: estadoId}},
              }));
            const found = await this.implementoModel.find({$and: elemMatchs})
                .populate('marca')
                .populate('categoria')
                .populate('estado.estado');

            if(!found){            
                throw new HttpException(MENSAJES_ERROR.ID_ESTADO_IMPLEMENTO_NO_VALIDO, HttpStatus.NOT_FOUND);
            }
            return found;
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_ESTADO_IMPLEMENTO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }        
    }

    async create(implemento: CreateImplementoDTO): Promise<any>{  
        try {
            let nImplTotal = 0;
            let nImplDispo = 0;
            implemento.estado.forEach((estado) => {
                nImplTotal += estado.cantidad;
                if(estado.apto === true){
                    nImplDispo += estado.cantidad;
                }
            });
            const newObjectDTO = implemento;
            newObjectDTO['cantidad'] = nImplTotal;
            newObjectDTO['cantidad_prestados'] = 0;
            newObjectDTO['cantidad_disponible'] = nImplDispo;
            const newImplemento = await new this.implementoModel(newObjectDTO).save();
            return newImplemento.populate([{path: 'marca'}, {path: 'categoria'}, {path: 'estado.estado'}]);
            //return new HttpException(MENSAJES_OK.IMPLEMENTO_CREADO, HttpStatus.ACCEPTED);
        } catch (error) {
            console.log(error);
            //throw new HttpException(MENSAJES_ERROR.CREAR_IMPLEMENTO, HttpStatus.BAD_REQUEST);
            return error;
        } 
    }

    /*async create(idEstado: string, implemento: CreateImplementoDTO){
        const objId = new Types.ObjectId(idEstado);        
        const newImplemento = new this.implementoModel(implemento);
        await newImplemento.save().then(async ()=>{
            await this.estadoImplementoService.update(idEstado, null, newImplemento._id.toString());
            throw new HttpException(MENSAJES_OK.IMPLEMENTO_CREADO, HttpStatus.ACCEPTED);
        }).catch(()=>{
            throw new HttpException("ERROR al crear el implemento", HttpStatus.BAD_REQUEST);
        });
    }*/

    async update(id: string, implemento: UpdateImplementoDTO): Promise<HttpException>{
        try {
            const objId = new Types.ObjectId(id);
            await this.implementoModel.findByIdAndUpdate(id, implemento, {new:true});
            return new HttpException(MENSAJES_OK.IMPLEMENTO_ACTUALIZADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_IMPLEMENTO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    }

    async delete(id: string){
        try {
            const objId = new Types.ObjectId(id);
            const found = await this.implementoModel.findOne({_id: objId});
            if(!found){            
                throw new HttpException(MENSAJES_ERROR.IMPLEMENTO_NO_EXISTE, HttpStatus.NOT_FOUND);
            }
            await this.implementoModel.findByIdAndDelete(id);
            return new HttpException(MENSAJES_OK.IMPLEMENTO_ELIMINADO, HttpStatus.ACCEPTED);
        } catch (error) {
            throw new HttpException(MENSAJES_ERROR.ID_IMPLEMENTO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
        }
    } 

    async reinicioImplementos(){
        try {
            let nImplTotal = 0;
            let nImplDispo = 0;
            const documentos = await this.implementoModel.find({});
            for(const doc of documentos){
                doc.estado.forEach((estado) => {
                    nImplTotal += estado.cantidad;
                    if(estado.apto === true){
                        nImplDispo += estado.cantidad;
                    }
                });
                doc.cantidad = nImplTotal;
                doc.cantidad_disponible = nImplDispo;
                doc.cantidad_prestados = 0;
                await doc.save();
            }
            console.log("OK");
        } catch (error) {
            console.log('ERROR ::: ', error);
        }
    }

}
