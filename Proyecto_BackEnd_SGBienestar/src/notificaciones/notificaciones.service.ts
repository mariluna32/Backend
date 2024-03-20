import { Injectable } from '@nestjs/common';
import { initializeApp } from "firebase/app";
import * as admin from 'firebase-admin';
import { NotificacionesDTO } from './dto/notificaciones.dto';

const firebaseConfig = {
    apiKey: "AIzaSyB1rRmrvMPEidjDvamknH75DAojevyzIhI",
    authDomain: "sgbienestar-803b9.firebaseapp.com",
    projectId: "sgbienestar-803b9",
    storageBucket: "sgbienestar-803b9.appspot.com",
    messagingSenderId: "286691692083",
    appId: "1:286691692083:web:8e152699c0d75e8a741d46",
    measurementId: "G-CFM3CJYHV3"
};

admin.initializeApp(firebaseConfig);
const fcm = admin.messaging();

@Injectable()
export class NotificacionesService {
    constructor() {}
    

    async enviarNotificacion(notificacionDTO: NotificacionesDTO){
        const message: admin.messaging.Message = {
            notification: {
              title: notificacionDTO.titulo,
              body: notificacionDTO.mensaje,
            },
            token: '',
            topic: ''
        };

        try {
            const response = await admin.messaging().send(message);
            console.log('Notificación enviada exitosamente:', response);
            return { success: true };
        }catch(error){
            console.error('Error al enviar la notificación:', error);
            return { success: false, error: error.message };
        }
    }
}

