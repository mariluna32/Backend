import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UploadedFile, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common';
import { FichaService } from './ficha.service';
import { CreateFichaDto, UpdateFichaDto } from './dto/create-ficha.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MENSAJES_ERROR } from 'src/StringValues';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Ficha")
@Controller('ficha')
export class FichaController {
  constructor(private readonly fichaService: FichaService) {}

  @Post()
  create(@Body() createFichaDto: CreateFichaDto) {
    return this.fichaService.create(createFichaDto);
  }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
 async upload(@UploadedFile() file) {
    if (!file) {
      return 'No se proporcionó ningún archivo.';
    }
    try {
      const jsonData = this.fichaService.upload(file.buffer);
      return jsonData;

    } catch (error) {
    throw new HttpException(MENSAJES_ERROR.FICHA_NO_SUBIDA, HttpStatus.CONFLICT)

    }
  }
  @Get()
  findAll() {
    return this.fichaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fichaService.findOneById(id);
  }

  @Get('codigo/:codigo')
  findOneByCode(@Param('codigo') codigo: string) {
    return this.fichaService.findOneByCode(codigo);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFichaDto: UpdateFichaDto) {
    return this.fichaService.update(id, updateFichaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fichaService.delete(id);
  }
}
