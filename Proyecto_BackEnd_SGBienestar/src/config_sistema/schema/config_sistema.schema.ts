import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: false, versionKey: false})
export class ConfigSistema{
    @Prop({
        unique: true,
        required: true,
        trim: true,
        type: 'String',
    })
    horario_inicio: string;
    @Prop({
        unique: true,
        required: true,
        trim: true,
        type: 'String',
    })
    horario_fin: string;
    @Prop({
        unique: true,
        required: true,
        trim: true,
        type: 'Number',
    })
    duracion_prestamo: number;
    @Prop({
        unique: true,
        required: true,
        trim: true,
        type: 'Number',
    })
    duracion_sancion: number;
}


export const ConfigSistemaSchema = SchemaFactory.createForClass(ConfigSistema)