import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

@Schema({timestamps: false, versionKey: false})
export class Rol {
    @Prop({
        unique: true,
        required: true,
        trim: true 
    })
    nombre: string;

    @Prop({
        required: true,
        trim: true
    })
    privilegio: number 

    @Prop({
        required: true,
        trim: true
    })
    duracion_prestamo: number 
}

export const RolSchema = SchemaFactory.createForClass(Rol)