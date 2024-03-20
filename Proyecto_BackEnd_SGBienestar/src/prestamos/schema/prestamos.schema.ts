import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { now } from "mongoose";

@Schema({timestamps: {
    currentTime: () => new Date(Date.now()-5*60*60*1000)
}})
export class Prestamos{
    @Prop({
        trim: true,
        required: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Implemento'
    })
    implementos: [string];

    @Prop({
        trim: true,
        required: true,
        type: [Number]
    })
    cantidad_implementos: [number];

    @Prop({
        trim: true,
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios'
    })
    usuario: string;
    
    @Prop({
        trim: true,
        required: true,
        type: String,
        default: Date.now.toString
    })
    fecha_inicio: string

    @Prop({
        trim: true,
        required: true,
        type: String,
        default: Date.now.toString
    })
    fecha_fin: string;

    @Prop({
        trim: true,
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EstadoPrestamo'
    })
    estado: string;
}

export const prestamoSchema = SchemaFactory.createForClass(Prestamos)