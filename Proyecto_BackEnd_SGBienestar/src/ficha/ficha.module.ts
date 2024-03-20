import { Module } from '@nestjs/common';
import { FichaService } from './ficha.service';
import { FichaController } from './ficha.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ficha, FichaSchema } from './schemas/ficha.schema';
import { Programa, ProgramaSchema } from 'src/programa/schema/programa.schema';


@Module({
  imports: [MongooseModule.forFeature([
    {name: Ficha.name,schema: FichaSchema},
    {name: Programa.name,schema: ProgramaSchema}
  ])  
],
  controllers: [FichaController],
  providers: [FichaService],
})
export class FichaModule {}













































/*
//import { MulterModule } from '@nestjs/platform-express'
//import { diskStorage } from 'multer'
/*MulterModule.register({
    storage: diskStorage({
      destination: '',
      filename: (req, file, cb) =>{
        return cb(null, file.originalName)
      }
    })
  })*/
