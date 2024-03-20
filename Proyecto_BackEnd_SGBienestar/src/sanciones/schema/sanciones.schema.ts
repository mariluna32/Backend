import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";


@Schema({timestamps: {
    currentTime: () => new Date(Date.now()-5*60*60*1000)
}})
export class Sancion{
    @Prop({
        required: true,
        trim: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuarios'
    })
    usuario: string

    @Prop({
        required: true,
        trim: true
    })
    description: string

    @Prop({
        required: true,
        trim: true
    })
    estado: boolean

    @Prop({
        required: true,
        trim: true
    })
    duracion: number
}

export const sancionesSchema = SchemaFactory.createForClass(Sancion)