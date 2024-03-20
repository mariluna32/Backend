import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ID_ESTADO_PRESTAMO_FALLIDO, ID_ESTADO_PRESTAMO_PENDIENTE } from 'src/StringValues';
import { Model, Types } from 'mongoose';
import { FinalizarPrestamoDTO } from './dto/create-prestamo.dto';
import { PrestamosService } from './prestamos.service';
import { MailService } from 'src/mail/mail.service';
import { MailSendDTO } from 'src/mail/dto/mail.dto';

@Injectable()
export class QuinceMinService {
    constructor(@Inject(forwardRef(() => PrestamosService)) readonly prestamosService: PrestamosService,
                @Inject(MailService) readonly mailService: MailService/*@InjectModel(Prestamos.name) private prestamoModel: Model<Prestamos>*/){}

    async init(prestamo: any): Promise<void> {
        this.startTimer(prestamo);
        console.log('Iniciando');
    }

    private async startTimer(prestamo: any): Promise<void> {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            this.validate(prestamo);
            resolve();
          }, 1 * 60 * 1000);
        });
    }

    private async validate(prestamo: any){
        prestamo = await this.prestamosService.findOne(prestamo['_id']);
        if(prestamo.estado._id.equals(new Types.ObjectId(ID_ESTADO_PRESTAMO_PENDIENTE))){
            const finalizarPrestamoDTO = new FinalizarPrestamoDTO();
            finalizarPrestamoDTO.id = prestamo.estado._id;
            finalizarPrestamoDTO.estado = ID_ESTADO_PRESTAMO_FALLIDO;
            try {
                const bodyMail = new MailSendDTO();
                bodyMail.asunto = 'Prestamo Cancelado';
                bodyMail.correo = prestamo.usuario.correo_inst;
                bodyMail.mensaje = `Su prestamo realizado en: ${prestamo.createdAt} fue cancelado, para mayor informacion pongase en contacto con Bienestar al Aprendiz`;
                this.mailService.makeMail(bodyMail);
                await this.prestamosService.finalizarPrestamo(finalizarPrestamoDTO, true);
            } catch (error) {
                
            }            
        }
        console.log('Finalizacion');
    }
}