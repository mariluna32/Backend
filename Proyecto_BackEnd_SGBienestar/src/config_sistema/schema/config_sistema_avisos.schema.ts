import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: false, versionKey: false})
export class ConfigSistemaAvisos{
    @Prop({
        required: true,
        trim: true,
        type: 'String',
    })
    titulo: string;
    @Prop({
        required: true,
        trim: true,
        type: 'String',
    })
    mensaje: string;
    @Prop({
        required: true,
        trim: true,
        type: 'String',
    })
    hora_inicio: string;
    @Prop({
        required: true,
        trim: true,
        type: 'String',
    })
    hora_fin: string;
    @Prop({
        required: true,
        trim: true,
        type: 'String',
    })
    src: string;
}


export const ConfigSistemaAvisosSchema = SchemaFactory.createForClass(ConfigSistemaAvisos)