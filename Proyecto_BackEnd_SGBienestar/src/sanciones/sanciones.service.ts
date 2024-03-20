import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateSancioneDto, UpdateSancioneDto } from './dto/create-sancione.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { Sancion } from './schema/sanciones.schema';
import { RegistroService } from 'src/registro/registro.service';
import { MailService } from 'src/mail/mail.service';
import { RolService } from 'src/rol/rol.service';
import { Usuarios } from 'src/registro/schemas/registro.schema';

@Injectable()
export class SancionesService {
  constructor(@InjectModel(Sancion.name) private readonly sancionModel: Model<Sancion>,
  @Inject(RegistroService) private registroService: RegistroService,
  @Inject(MailService)readonly mailService: MailService) {} //, @Inject(RegistroService) readonly registroService: RegistroService

  async create(createSancioneDto: CreateSancioneDto) {
    const found = await this.registroService.findOneById(createSancioneDto.usuario);
    const tiempo_Horas = createSancioneDto.duracion
    let tiempo: string = ""
    const newSancion = new this.sancionModel(createSancioneDto);
    await newSancion.save();
    
    if(tiempo_Horas < 24){
    tiempo = `${tiempo_Horas} horas`
    }else{
      const dias = Math.floor(tiempo_Horas / 24)
    tiempo =  `${dias} dias`
    }
     
    
    try {
      console.log(found.correo_inst)
      this.mailService.makeMail({
        correo: [found.correo_inst],
        asunto: 'Información sobre la sanción',
        mensaje: 
                    `
                    <html>
                    <head>
                        <title>Servicio Nacional de Aprendizaje</title>
                    </head>
                    <body>
                        <table align="center" width="600" cellspacing="0" cellpadding="0" border="0">
                            <tr>
                                <td bgcolor="#f2f2f2" style="padding: 20px; text-align: center;">
                                <h1 style="color: #000000;">Servicio Nacional de Aprendizaje</h1>
                                    <p style="color: #000000;">Estimado usuario <b>${found.nombres}</b> por parte de administracion se le informa que.</p>
                                    <p style="color: #000000;">Usted ha sido sancionado a causa de: <b>${createSancioneDto.description}</b></p>
                                    <p style="color: #000000;">Con una duracion de: <b>${tiempo}</b></p>
                                    <p style="color: #000000;">Si consideras que hay algun tipo de error por favor comunicate con el personal de Bienestar al aprendiz.</p>
                                    <p style="color: #000000;">¡Es un placer tenerte como parte de nuestra comunidad!</p>
                                    <p></p>
                                    <p style="color: #000000;">Atentamente, Equipo de Bienestar.</p>
                                </td>
                            </tr>
                        </table>
                    </body>
                    </html>`
      });
    } catch (error) {
      throw new HttpException('Error al enviar el correo', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    throw new HttpException('Sanción creada con éxito, se ha enviado un correo al usuario con la inormacion', HttpStatus.ACCEPTED);
  }




  findAll() {
    return this.sancionModel.find()
    .populate(
      {path:'usuario',
        populate:{
          path: 'ficha', 
          populate:{
            path: 'programa' 
          }
        } 
      }
    )
    .populate(
      {path:'usuario', 
        populate:{
          path: 'rol'
        } 
      }
    );
  }

  async findOneByUsuario(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.sancionModel.find({ usuario: objId }).populate(
        {path:'usuario',
          populate:{
            path: 'ficha', 
            populate:{
              path: 'programa' 
            }
          } 
        }
      )
      .populate(
        {path:'usuario', 
          populate:{
            path: 'rol'
          } 
        }
      );
      if (!found) {
        throw new HttpException(MENSAJES_ERROR.SANCION_NO_EXISTE, HttpStatus.NOT_FOUND);
      }
      return found;
    } catch (error) {
      throw new HttpException(MENSAJES_ERROR.ID_SANCION_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async findOneByUsuarioDoc(doc: string) {
    try {
      const sanciones = await this.sancionModel.find()
      .populate(
        {path:'usuario',
          populate:{
            path: 'ficha', 
            populate:{
              path: 'programa' 
            }
          } 
        }
      )
      .populate(
        {path:'usuario', 
          populate:{
            path: 'rol'
          } 
        }
      );

      if(!sanciones){
        return null;
      }

      const sancionF = [];
      sanciones.map((sancion) => {
        if(sancion.usuario["n_doc"] === doc){
          sancionF.push(sancion);
        }
      });

      return sancionF;
      
    } catch (error) {
      throw new HttpException(MENSAJES_ERROR.ID_SANCION_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
  }
  
  async findOneById(id: string) {
    try {
      const objId = new Types.ObjectId(id);
      const found = (await this.sancionModel.findOne({ _id: objId }).populate('usuario'));
      if (!found) {
        throw new HttpException(MENSAJES_ERROR.SANCION_NO_EXISTE, HttpStatus.NOT_FOUND);
      }
      return found;
    } catch (error) {
      throw new HttpException(MENSAJES_ERROR.ID_SANCION_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
  }
  async update(id: string, registro: UpdateSancioneDto) {
    try {
      const objId = new Types.ObjectId(id);
      const found = await this.sancionModel.findOne({ _id: objId });
      if (!found) {
        throw new HttpException(MENSAJES_ERROR.SANCION_NO_EXISTE, HttpStatus.NOT_FOUND);
      }
      await this.sancionModel.findByIdAndUpdate(id, registro, { new: true });
      return new HttpException(MENSAJES_OK.SANCION_ACTUALIZADA, HttpStatus.ACCEPTED);
    } catch (error) {
      throw new HttpException(MENSAJES_ERROR.ID_SANCION_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
  }

  async delete(id: string){
    try {
        const objId = new Types.ObjectId(id);
        const found = await this.sancionModel.findOne({_id: objId});
        if(!found){            
            throw new HttpException(MENSAJES_ERROR.SANCION_NO_EXISTE, HttpStatus.NOT_FOUND);
        }
        await this.sancionModel.findByIdAndDelete(id);
        return new HttpException(MENSAJES_OK.SANCION_ELIMINADA, HttpStatus.ACCEPTED);
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_SANCION_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
}

}
