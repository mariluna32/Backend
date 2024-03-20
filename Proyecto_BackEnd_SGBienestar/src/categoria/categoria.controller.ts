import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/create-categoria.dto';
import { ApiTags } from '@nestjs/swagger';
import { CategoriaService } from './categoria.service';

@ApiTags("Categoria")
@Controller('categoria')
export class CategoriaController {
  constructor(private readonly CategoriaService: CategoriaService) {}

  @Post()
  create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.CategoriaService.create(createCategoriaDto);
  } 

  @Get()
  findAll() {
    return this.CategoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.CategoriaService.findOneById(id);
  }

  @Put("/update/:id")
    update(@Param("id") id: string, @Body() body:UpdateCategoriaDto){
        return this.CategoriaService.update(id, body);
    }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.CategoriaService.remove(id);
  }
}
  

