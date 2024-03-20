import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({timestamps: false, versionKey: false})
export class Marca{
  @Prop({
    unique: true,
    trim: true,
    required: true,
  })
  nombre: string;
  descripcion: any;
  id: number;
}

export const MarcaSchema = SchemaFactory.createForClass(Marca);