/* eslint-disable */
import { HttpException, HttpStatus, Injectable, Res, Body } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { MailSendDTO } from 'src/mail/dto/mail.dto';
import { Response } from 'express';
import { MENSAJES_ERROR, MENSAJES_OK } from 'src/StringValues';
import { InjectModel } from '@nestjs/mongoose';
import { Mails } from './schema/mail.schema';
import { Model, Types } from 'mongoose';
import { Comentarios } from './schema/comentarios.schema';
import { ComentarioSendDTO } from './dto/comentario.dto';
import { Usuarios } from 'src/registro/schemas/registro.schema';
dotenv.config();

@Injectable()
export class MailService {
  constructor(@InjectModel(Mails.name) private mailModel: Model<Mails>,
  @InjectModel(Comentarios.name) private comentariosModel: Model<Comentarios>,
  @InjectModel(Usuarios.name) private usuarioModel: Model<Usuarios>){}
  async sendMails(correo: string[] = [process.env.CORREO_ELECTRONICO], mensaje: string, asunto: string) {
    const transporter = await nodeMailer 
    .createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.CORREO_ELECTRONICO,
        pass: process.env.PASSWORD_CORREO_ELECTRONICO,
      },
  });

   await transporter.sendMail(
      {
        from: process.env.CORREO_ELECTRONICO,
        to: correo.map((correos) => correos),
        subject: `${asunto}`,
        html: `${mensaje}`,
      },
    );
  }

   async makeMail(@Body() body: MailSendDTO, @Res() res?: Response){
    try{
      await this.sendMails(body.correo, body.mensaje, body.asunto);  
      if(res != null){
        res.status(HttpStatus.OK).json({
          status: HttpStatus.OK,
          message: MENSAJES_OK.CORREO_ENVIADO
        });
      }
    } catch (error){
      if(res != null){
        res.status(HttpStatus.BAD_REQUEST).json({
          status: HttpStatus.BAD_REQUEST,
          message: MENSAJES_ERROR.CORREO_NO_ENVIADO
        });
      }
    }
  } 

  async AdminNotificacion(@Body() correos: MailSendDTO, @Res() res?: Response){
   try{
    await this.sendMails(correos.correo.map((corre) => corre), `<html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Notificación de Sanción - SGbienestar</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; margin-top: 20px;">
        <tr>
          <td style="text-align: center; padding: 20px 0;">
            <img src="logo-sgbienestar.png" alt="SGbienestar Logo" width="150">
          </td>
        </tr>
        <tr>
          <td style="background-color: #007bff; color: #ffffff; padding: 20px; font-size: 24px; text-align: center;">
            Notificación de Sanción
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; font-size: 16px;">
            <p>Estimado usuario de SGbienestar,</p>
            <p>${correos.mensaje}.</p>
            <p>Si tiene alguna pregunta o necesita más información sobre esta sanción, no dude en ponerse en contacto con nuestro equipo de soporte.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px; font-size: 14px;">
            Póngase en contacto con nosotros en <a href="mailto:${process.env.CORREO_ELECTRONICO}">${process.env.CORREO_ELECTRONICO}</a> para obtener asistencia.
          </td>
        </tr>
      </table>
      <div style="text-align: center; margin-top: 20px; color: #999;">
        © 2023 SGbienestar. Todos los derechos reservados.
      </div>
    </body>
    </html>`, correos.asunto);  
    const newCorreo = new this.mailModel(correos)
    await newCorreo.save()
    if(res != null){
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: MENSAJES_OK.CORREO_ENVIADO,
        _id: newCorreo._id
      });
    }
  } catch (error){
    if(res != null){
      res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: MENSAJES_ERROR.CORREO_NO_ENVIADO
      });
    }
  }
  }
  async ComentarioUsuario(@Body() correos: ComentarioSendDTO, @Res() res?: Response){
    try{
      const usuario = correos.correo.length <= 1 ? 'Anonimo' : correos.correo  
     await this.sendMails( [process.env.CORREO_ELECTRONICO], `<html lang="en">
     <head>
     <meta charset="UTF-8">
     <meta name="viewport" content="width=device-width, initial-scale=1.0">
     <title>Recomendación de Usuario - SGbienestar</title>
   </head>
   <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
     <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; margin-top: 20px;">
       <tr>
         <td style="text-align: center; padding: 20px 0;">
           <img src="logo-sgbienestar.png" alt="SGbienestar Logo" width="150">
         </td>
       </tr>
       <tr>
         <td style="background-color: #007bff; color: #ffffff; padding: 20px; font-size: 24px; text-align: center;">
           Recomendación de Usuario
         </td>
       </tr>
       <tr>
         <td style="padding: 20px; font-size: 16px;">
           <p>Estimado equipo de SGbienestar,</p>
           <p>${correos.mensaje}.</p>
           <p>Recibimos una recomendación de uno de nuestros usuarios con el correo: <b>${usuario}</b> y queríamos compartirla contigo.</p>
           <p>Esperamos que esta recomendación sea útil y valiosa para mejorar nuestros servicios.</p>
         </td>
       </tr>
       <tr>
         <td style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px; font-size: 14px;">
           Si tienes alguna pregunta o deseas más información sobre esta recomendación, no dudes en ponerte en contacto con nosotros.
         </td>
       </tr>
     </table>
     <div style="text-align: center; margin-top: 20px; color: #999;">
       © 2023 SGbienestar. Todos los derechos reservados.
     </div>
   </body>
   </html>
   `, correos.asunto);  
     const newCorreo = new this.comentariosModel(correos)
     await newCorreo.save()
     if(res != null){
       res.status(HttpStatus.OK).json({
         status: HttpStatus.OK,
         message: MENSAJES_OK.CORREO_ENVIADO,
         _id: newCorreo._id
       });
     }
   } catch (error){
     if(res != null){
       res.status(HttpStatus.BAD_REQUEST).json({
         status: HttpStatus.BAD_REQUEST,
         message: MENSAJES_ERROR.CORREO_NO_ENVIADO
       });
     }
   }
  }
  async delete(id: string){
    try {
        const objId = new Types.ObjectId(id);
        const found = await this.mailModel.findOne({_id: objId});
        if(!found){            
            throw new HttpException(MENSAJES_ERROR.MAIL_NO_EXISTE, HttpStatus.NOT_FOUND);
        }
        await this.mailModel.findByIdAndDelete(id);
        return new HttpException(MENSAJES_OK.MAIL_ELIMINADO, HttpStatus.ACCEPTED);
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_MAIL_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }
}

  findAll(){
    return this.mailModel.find()
  }

  async findOneById(id: string){
    try {
        const objId = new Types.ObjectId(id);
        const found = await this.mailModel.findOne({_id: objId});
        if(!found){            
            throw new HttpException(MENSAJES_ERROR.CORREO_NO_EXISTE, HttpStatus.NOT_FOUND);
        }
        return found;
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_MAIL_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    }        
}

async deleteComentario(id: string){
  try {
      const objId = new Types.ObjectId(id);
      const found = await this.comentariosModel.findOne({_id: objId});
      if(!found){            
          throw new HttpException(MENSAJES_ERROR.MAIL_NO_EXISTE, HttpStatus.NOT_FOUND);
      }
      await this.mailModel.findByIdAndDelete(id);
      return new HttpException(MENSAJES_OK.MAIL_ELIMINADO, HttpStatus.ACCEPTED);
  } catch (error) {
      throw new HttpException(MENSAJES_ERROR.ID_MAIL_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
  }
}

findAllComentarios(){
  return this.comentariosModel.find()
}

async findOneComentarioById(id: string){
  try {
      const objId = new Types.ObjectId(id);
      const found = await this.comentariosModel.findOne({_id: objId});
      if(!found){            
          throw new HttpException(MENSAJES_ERROR.CORREO_NO_EXISTE, HttpStatus.NOT_FOUND);
      }
      return found;
  } catch (error) {
      throw new HttpException(MENSAJES_ERROR.ID_MAIL_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
  }        
}

  async findComentariosXusuarioXid(id: string){
    try {
      const objId = new Types.ObjectId(id);
      const usuario = await this.usuarioModel.findOne({_id: objId});
      const found = await this.comentariosModel.find({correo: usuario.correo_inst});
      if(!found){            
          throw new HttpException(MENSAJES_ERROR.CORREO_NO_EXISTE, HttpStatus.NOT_FOUND);
      }
      return found;
    } catch (error) {
        throw new HttpException(MENSAJES_ERROR.ID_MAIL_NO_VALIDO, HttpStatus.NOT_ACCEPTABLE);
    } 
  }


}