import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//currentTime: () => new Date(Date.now()-5*60*60*1000)
@Schema({timestamps: false, versionKey: false})
export class Categoria {
  @Prop({
    unique: true,
    trim: true,
    required: true,
  })
  nombre: string;
  @Prop({
    trim: true,
    required: true,
  })
  img: string;
}

export const CategoriaSchema = SchemaFactory.createForClass(Categoria);