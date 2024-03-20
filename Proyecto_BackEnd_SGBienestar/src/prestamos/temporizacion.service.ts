import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { MailService } from 'src/mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UpdatePrestamoDto } from './dto/create-prestamo.dto';
import { ID_ESTADO_PRESTAMO_PERDIDO, ID_ESTADO_PRESTAMO_RETRASADO } from 'src/StringValues';
import { MailSendDTO } from 'src/mail/dto/mail.dto';

@Injectable()
export class TemporizacionService {
    constructor(@Inject(forwardRef(() => PrestamosService)) readonly prestamosService: PrestamosService,
                @Inject(MailService) readonly mailService: MailService){}

    

    @Cron(CronExpression.EVERY_10_MINUTES)
    async handlePrestamosRetrasados(): Promise<void> {
        const prestamos = await this.prestamosService.findPrestamosPerdidos();
        prestamos[0].forEach(async (prestamo) => {
            const info = new UpdatePrestamoDto();   
            info.estado = ID_ESTADO_PRESTAMO_RETRASADO;
            await this.prestamosService.update(prestamo._id.toString(), info);
            try {
                const bodyMail = new MailSendDTO();
                bodyMail.asunto = 'Prestamo Retrasado';
                bodyMail.correo = prestamo.usuario.correo_inst;
                bodyMail.mensaje = `Desde Bienestar al Aprendiz, le recordamos la importancia de realizar la devolución de los implementos prestados en el tiempo acordado, de esa forma evitara sanciones`;
                this.mailService.makeMail(bodyMail);
            } catch (error) {
                
            } 
        });

        prestamos[1].forEach(async (prestamo) => {
            const info = new UpdatePrestamoDto();   
            info.estado = ID_ESTADO_PRESTAMO_PERDIDO;
            await this.prestamosService.update(prestamo._id.toString(), info);
            try {
                const bodyMail = new MailSendDTO();
                bodyMail.asunto = 'Devolución Inmediata de los implementos';
                bodyMail.correo = prestamo.usuario.correo_inst;
                bodyMail.mensaje = `Desde Bienestar al Aprendiz, le recordamos la importancia de realizar la devolución de los implementos prestados en el tiempo acordado, de esa forma evitara sanciones`;
                this.mailService.makeMail(bodyMail);
            } catch (error) {
                
            }
        });
        /*const retrasados = await this.prestamosService.findPrestamosPerdidos();
        retrasados.forEach(async (prestamo) =>{      
            const info = new UpdatePrestamoDto();   
            info.estado = ID_ESTADO_PRESTAMO_PERDIDO;
            await this.prestamosService.update(prestamo['_id'].toString(), info);
        });*/
    }
}