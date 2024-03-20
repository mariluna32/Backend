import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePrestamoDto, FinalizarPrestamoDTO, UpdatePrestamoDto } from './dto/create-prestamo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Prestamos } from './schema/prestamos.schema';
import { Model, Types } from 'mongoose';
import { DURACION_SANCION_DEFAULT, FORMATO_FECHA, ID_ESTADO_PRESTAMO_APROBADO, ID_ESTADO_PRESTAMO_ELIMINADO, ID_ESTADO_PRESTAMO_PENDIENTE, MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { Implemento } from 'src/implementos/schema/implementos.schema';
import { QuinceMinService } from './quincemin.service';
import { CreateSancioneDto } from 'src/sanciones/dto/create-sancione.dto';
import { SancionesService } from 'src/sanciones/sanciones.service';
import { ConfigSistemaService } from 'src/config_sistema/config_sistema.service';

@Injectable()
export class PrestamosService {
  constructor(@InjectModel(Prestamos.name) private prestamoModel: Model<Prestamos>,
              @InjectModel(Implemento.name) private implementoModel: Model<Implemento>,
              @Inject(QuinceMinService) readonly quinceMinService: QuinceMinService,
              @Inject(SancionesService) readonly sancionesService: SancionesService,
              @Inject(ConfigSistemaService) readonly configSistemaService: ConfigSistemaService) {}

  async create(createPrestamoDto: CreatePrestamoDto) {
    try{
      /*const objectIDs = [];
      createPrestamoDto.implementos.forEach((implementoID) => {
        const objId = new Types.ObjectId(implementoID);
        objectIDs.push(objId);
      });      
      const implementos = await this.implementoModel.find({_id: {$in: objectIDs}});*/
      const implementos = await this.obtenerImplementosPrestamo(createPrestamoDto.implementos);
      implementos.forEach((implemento, i) => {
        if(implemento.cantidad_disponible < createPrestamoDto.cantidad_implementos[i]){
          //throw new HttpException(`ERROR: La cantidad de implementos (${implemento.nombre}) disponibles es menor que la solicitada`, HttpStatus.BAD_REQUEST);
          return `ERROR: La cantidad de implementos (${implemento.nombre}) disponibles es menor que la solicitada`;
        }
      });

      const actualizacion = implementos.map((implemento, i) => ({
        updateOne: {
          filter: {_id: implemento._id},
          update: {
            $set: {
              cantidad_prestados: implemento.cantidad_prestados + createPrestamoDto.cantidad_implementos[i],
              cantidad_disponible: implemento.cantidad_disponible - createPrestamoDto.cantidad_implementos[i]
            }
          },
        },
      })); 

      const resultado = await this.implementoModel.bulkWrite(actualizacion);
      if(!resultado){
        //throw new HttpException('ERROR : Al actualizar los implementos', HttpStatus.BAD_REQUEST);
        return 'ERROR : Al actualizar los implementos';
      }     
      const newPrestamo = new this.prestamoModel(createPrestamoDto);
      const prest = await newPrestamo.save();
      this.quinceMinService.init(prest);
      //throw new HttpException(MENSAJES_OK.PRESTAMO_CREADO, HttpStatus.ACCEPTED)
      return prest._id;
    }catch(error){
      //throw new HttpException('ERROR ::: ' + error, HttpStatus.BAD_REQUEST);
      return ('ERROR ::: ' + error);
    }
    
  }

  async aprobarPrestamo(id: string){
    try {
      const moment = require('moment-timezone'); 
      const objId = new Types.ObjectId(id);
      const fechaInicio = moment().tz('America/Bogota');
      const configSistema = await this.configSistemaService.findAll();
      let tiempoPrestamo = configSistema.duracion_prestamo;
      if(tiempoPrestamo == null || tiempoPrestamo == undefined){tiempoPrestamo = 1;}

      this.prestamoModel.findOneAndUpdate({ 
        _id: objId
      },
      {
        $set: {
          estado: new Types.ObjectId(ID_ESTADO_PRESTAMO_APROBADO),
          fecha_inicio: fechaInicio.format(FORMATO_FECHA),
          fecha_fin: fechaInicio.add(tiempoPrestamo, 'hour').format(FORMATO_FECHA)
        }
      },
      {new: true}).exec();
      return ;
    } catch (error) {    

    }
  }

  async finalizarPrestamo(finalizarPrestamoDTO: FinalizarPrestamoDTO, actualizarEstado: boolean): Promise<HttpException>{
    try {
      const objId = new Types.ObjectId(finalizarPrestamoDTO.id);
      const prestamo = await this.prestamoModel.findOne({_id: objId});
      const implementos = await this.obtenerImplementosPrestamo(prestamo.implementos);

      const actualizacion = implementos.map((implemento, i) => ({
        updateOne: {
          filter: {_id: implemento._id},
          update: {
            $set: {
              cantidad_prestados: implemento.cantidad_prestados - prestamo.cantidad_implementos[i],
              cantidad_disponible: implemento.cantidad_disponible + prestamo.cantidad_implementos[i]
            }
          },
        },
      })); 
      const resultado = await this.implementoModel.bulkWrite(actualizacion);
      if(!resultado){
        throw new HttpException('ERROR : Al actualizar los implementos', HttpStatus.BAD_REQUEST);
      }
      if(actualizarEstado){
        const updatePrestamo = await this.prestamoModel.updateOne({_id: objId}, {$set: {estado: finalizarPrestamoDTO.estado}});
      }

      const moment = require('moment-timezone');
      const fecha = moment(moment().tz('America/Bogota').format(FORMATO_FECHA));
      const fechaFin = moment(prestamo.fecha_fin).add(30, 'minutes');
      if(fechaFin.isBefore(fecha)){
        // aplicar sancion
        const sancionBody = new CreateSancioneDto();
        sancionBody.usuario = prestamo.usuario;
        sancionBody.description = 'Entrega fuera de tiempo';
        sancionBody.estado = true;
        const configSistema = await this.configSistemaService.findAll();
        sancionBody.duracion = configSistema.duracion_sancion; //DURACION_SANCION_DEFAULT;
        try {
          await this.sancionesService.create(sancionBody);
        } catch (error) {}        
      }

      throw new HttpException('Prestamo Finalizado', HttpStatus.ACCEPTED);
    } catch (error) {
      throw new HttpException('ERROR ::: ' + error, HttpStatus.BAD_REQUEST);
    }
  }

  async obtenerImplementosPrestamo(implementos: string[]){
    try {
      const objectIDs = [];
      implementos.forEach((implementoID) => {
        const objId = new Types.ObjectId(implementoID);
        objectIDs.push(objId);
      });
      return await this.implementoModel.find({_id: {$in: objectIDs}});
    } catch (error) {
      
    }
  }


  findAll() {
    return  this.prestamoModel.find()
    .populate({
      path: 'implementos',
      populate: [{
        path: 'marca'
      },{
        path: 'categoria'
      },{
        path: 'estado.estado'
      }]
    })
    .populate('estado')
    .populate({
      path: 'usuario',
      populate: [
        {path: 'rol'},
        {path: 'ficha', populate: {path: 'programa'}}
      ]
    });
  }

 async findOne(id: string) {
  try{
    const objId = new Types.ObjectId(id)
    const found = await this.prestamoModel.findOne({_id: objId})
    .populate({
      path: 'implementos',
      populate: [{
        path: 'marca'
      },{
        path: 'categoria'
      },{
        path: 'estado.estado'
      }]
    })
    .populate('estado')
    .populate({
      path: 'usuario',
      populate: [
        {path: 'rol'},
        {path: 'ficha', populate: {path: 'programa'}}
      ]
    });
    if(!found){
      throw new HttpException(MENSAJES_ERROR.PRESTAMO_NO_EXISTE, HttpStatus.NOT_FOUND)
    }
    return found
    } catch(error){
      throw new HttpException(MENSAJES_ERROR.ID_PRESTAMO_NO_VALIDO,HttpStatus.NOT_ACCEPTABLE)
    } 
  }

  async findByUsuario(id: string) {
    try{
      const objId = new Types.ObjectId(id)
      const found = await this.prestamoModel.find({usuario: objId})
      .populate({
        path: 'implementos',
        populate: [{
          path: 'marca'
        },{
          path: 'categoria'
        },{
          path: 'estado.estado'
        }]
      })
      .populate('estado')
      .populate({
        path: 'usuario',
        populate: [
          {path: 'rol'},
          {path: 'ficha', populate: {path: 'programa'}}
        ]
      });
      if(!found){
        throw new HttpException(MENSAJES_ERROR.PRESTAMO_NO_EXISTE, HttpStatus.NOT_FOUND)
      }
      return found
    } catch(error){
      throw new HttpException(MENSAJES_ERROR.ID_PRESTAMO_NO_VALIDO,HttpStatus.NOT_ACCEPTABLE)
    } 
  }

  async findByEstado(id: string) {
    try{
      const objId = new Types.ObjectId(id)
      const found = await this.prestamoModel.find({estado: objId})
      .populate({
        path: 'implementos',
        populate: [{
          path: 'marca'
        },{
          path: 'categoria'
        },{
          path: 'estado.estado'
        }]
      })
      .populate('estado')
      .populate({
        path: 'usuario',
        populate: [
          {path: 'rol'},
          {path: 'ficha', populate: {path: 'programa'}}
        ]
      });
      if(!found){
        throw new HttpException(MENSAJES_ERROR.PRESTAMO_NO_EXISTE, HttpStatus.NOT_FOUND)
      }
      return found
    } catch(error){
      throw new HttpException(MENSAJES_ERROR.ID_PRESTAMO_NO_VALIDO,HttpStatus.NOT_ACCEPTABLE)
    } 
  }

  async findByUsuarioByEstado(id: string, idEstado: string) {
    try{
      const objId = new Types.ObjectId(id)
      const objIdEstado = new Types.ObjectId(idEstado)
      const found = await this.prestamoModel.find({usuario: objId, estado: objIdEstado})
      .populate({
        path: 'implementos',
        populate: [{
          path: 'marca'
        },{
          path: 'categoria'
        },{
          path: 'estado.estado'
        }]
      })
      .populate('estado')
      .populate({
        path: 'usuario',
        populate: [
          {path: 'rol'},
          {path: 'ficha', populate: {path: 'programa'}}
        ]
      });
      if(!found){
        throw new HttpException(MENSAJES_ERROR.PRESTAMO_NO_EXISTE, HttpStatus.NOT_FOUND)
      }
      return found
    } catch(error){
      throw new HttpException(MENSAJES_ERROR.ID_PRESTAMO_NO_VALIDO,HttpStatus.NOT_ACCEPTABLE)
    } 
  }

  async getImplementos(){
    const prestamos = await this.prestamoModel.find().populate('implementos').select(['implementos', 'cantidad_implementos']).exec();
    
    prestamos.forEach((prestamo) => {

    });
    
    //let unidades = 0;

    /*
    [id:{
      cantidad: 0
    }]
    */
    /*const impl = {};
    prestamos.forEach((prestamo, i) => {
      prestamo.implementos.forEach((implemento, j) => {

        if(!impl[implemento['_id']]){
          implemento['estado'].forEach((estado, k) => {
            if(estado.apto === true){
              if(impl[implemento['_id']]){
                impl[implemento['_id']].cantidad_total += estado.cantidad;
              }else{
                impl[implemento['_id']] = {
                  cantidad_total: estado.cantidad,
                  cantidad_prestados: prestamo.cantidad_implementos[j],
                  cantidad_disponible: estado.cantidad - prestamo.cantidad_implementos[j]
                };
              }
            }
          });
        }
      });
    });
    console.log(impl);*/
    return prestamos;
  }  

  async getImplementosPrestadosHoyUsuario(id: string){
    try {
      const moment = require('moment-timezone');
      const fechaFin = moment().tz('America/Bogota');
      const fechaInicio = fechaFin.clone().startOf('day');
      const objId = new Types.ObjectId(id);
      const found = await this.prestamoModel.find(
        {
          usuario: objId,
          createdAt: {
            $gte: moment(fechaInicio).toDate(),
            $lte: moment(fechaFin).toDate(),
          }
        }).select('implementos').populate({path: 'implementos', select: 'nombre'}).exec();
      
      const implementos = [];
      found.forEach((implemento) => {
        implemento.implementos.forEach((impl) => {
          implementos.push({
            _id: impl['_id'],
            nombre: impl['nombre']
          });
        });
      });
      return implementos;
    } catch (error) {
      console.log('ERROR ::: ', error);
    }
    
  }

  async findPrestamosPerdidos(){
    const moment = require('moment-timezone');
    const fecha = moment(moment().tz('America/Bogota').format(FORMATO_FECHA));
    const prestamos = await this.prestamoModel.find({estado: ID_ESTADO_PRESTAMO_APROBADO}).populate('usuario').exec();
    const arrayPrestamos = [];
    const prestamosPerdidos = [];
    const prestamosRetrasados = [];
    
    prestamos.forEach((prestamo) => {
      const fecha_finPerdidos = moment(moment(prestamo.fecha_fin).tz('America/Bogota').format(FORMATO_FECHA));
      fecha_finPerdidos.add(48, 'hours');
      const fecha_finRetrasados = moment(moment(prestamo.fecha_fin).tz('America/Bogota').format(FORMATO_FECHA));
      fecha_finPerdidos.add(30, 'minutes');
      if(fecha_finPerdidos.isBefore(fecha)){
        prestamosPerdidos.push(prestamo);
      }else if(fecha_finRetrasados.isBefore(fecha)){
        prestamosRetrasados.push(prestamo);
      }
    });
    arrayPrestamos.push(prestamosRetrasados);
    arrayPrestamos.push(prestamosPerdidos);
    return arrayPrestamos;

    /*const retrasados = prestamos.map((prestamo) => {
      const fecha_fin = moment(moment(prestamo.fecha_fin).tz('America/Bogota').format(FORMATO_FECHA));
      fecha_fin.add(48, 'hours');
      if(fecha_fin.isBefore(fecha)){
        return prestamo;
      }
    });
    return retrasados;*/
  }


  async update(id: string, prestamo: UpdatePrestamoDto){
    try {
        const objId = new Types.ObjectId(id);
        const found = await this.prestamoModel.findOne({_id: objId});
        if(!found){            
            throw new HttpException(MENSAJES_ERROR.USUARIO_NO_EXISTE, HttpStatus.NOT_FOUND);
        }
        await this.prestamoModel.findByIdAndUpdate(id, prestamo, {new:true});
        return new HttpException(MENSAJES_OK.USUARIO_ACTUALIZADO, HttpStatus.ACCEPTED);
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_USUARIO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
}

  async delete(id: string) {
    try {
      const objId = new Types.ObjectId(id) 
      const found = await this.prestamoModel.findOne({_id: objId})
      if(!found){
        throw new HttpException(MENSAJES_ERROR.PRESTAMO_NO_EXISTE, HttpStatus.NOT_FOUND)
      }
      const finalizarPrestamoDTO = new FinalizarPrestamoDTO();
      finalizarPrestamoDTO.id = id;
      finalizarPrestamoDTO.estado = ID_ESTADO_PRESTAMO_ELIMINADO;
      try {
        await this.finalizarPrestamo(finalizarPrestamoDTO, false);
      } catch (error) {
        
      }
      await this.prestamoModel.findByIdAndDelete(objId)
      return new HttpException(MENSAJES_OK.PRESTAMO_ELIMINADO, HttpStatus.ACCEPTED)
    } catch (error) {
      throw new HttpException(MENSAJES_ERROR.ID_PRESTAMO_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE)
    }
  }

}
