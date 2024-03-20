import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: {
    currentTime: () => new Date(Date.now()-5*60*60*1000)
}, versionKey: false})
export class Comentarios{
    @Prop({
        trim: true
    })
    correo: string

    @Prop({
        required: true,
        trim: true
    })
    mensaje: string
    
    @Prop({
        required: true,
        trim: true
    })
    asunto: string
    
}

export const comentariosSchema = SchemaFactory.createForClass(Comentarios)