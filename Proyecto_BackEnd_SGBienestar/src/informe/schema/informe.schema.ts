import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps: false, versionKey: false})
export class Informe{
    @Prop({
        required: true,
        trim: true
    })
    nombre: string

    @Prop({
        required: true,
        trim: true,
        default: ''
    })
    fecha: string

    @Prop({
        required: true,
        trim: true,
        default: 0
    })
    numero: number;

    @Prop({
        required: true,
        trim: true,
        default: ''
    })
    pathPdf: string;

    @Prop({
        required: true,
        trim: true,
        default: ''
    })
    pathXlsx: string;
}

export const InformeSchema = SchemaFactory.createForClass(Informe);