import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({timestamps: false, versionKey: false})
export class EstadoPrestamo{
    @Prop({
        required: true,
        trim: true
    })
    nombre: string
}

export const EstadoPrestamoSchema = SchemaFactory.createForClass(EstadoPrestamo);