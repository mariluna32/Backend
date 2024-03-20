import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps: false, versionKey: false})
export class TipoInforme{
    @Prop({
        required: true,
        trim: true
    })
    nombre: string

    @Prop({
        required: true,
        trim: true,
        default: 0
    })
    numero: number;
}

export const TipoInformeSchema = SchemaFactory.createForClass(TipoInforme);