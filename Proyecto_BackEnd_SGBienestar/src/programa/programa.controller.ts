import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProgramaService } from './programa.service';
import { CreateProgramaDTO, UpdateProgramaDTO } from './dto/programa.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MENSAJES_ERROR } from 'src/StringValues';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Programa-Formacion")
@Controller('programa')
export class ProgramaController {
    constructor(private readonly programaService: ProgramaService){}
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file) {
      if (!file) {
        return 'No se proporcionó ningún archivo.';
      }
      try {
        const jsonData = this.programaService.create(file.buffer);
        return jsonData;
      } catch (error) {
        throw new HttpException(MENSAJES_ERROR.PROGRAMA_NO_SUBIDO, HttpStatus.CONFLICT)
      }
    }
  
    @Get("/programa")
    findAll(){
        return this.programaService.findAll();
    }

    @Get("/programa/:id")
    findOneById(@Param("id") id?: string){
        return this.programaService.findOneById(id);    
    }

    @Post()
    async create(@Body() body: CreateProgramaDTO) {
        return this.programaService.create(body);
    }

    @Delete("/programa/:id")
    delete(@Param("id") id: string){
        return this.programaService.delete(id);
    }

    @Put("/programa/:id")
    update(@Param("id") id: string, @Body() body:UpdateProgramaDTO){
        return this.programaService.update(id, body);
    }
}
