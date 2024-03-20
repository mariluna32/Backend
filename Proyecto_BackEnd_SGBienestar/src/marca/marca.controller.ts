import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { CreateMarcaDto, UpdateMarcaDto } from './dto/create-marca.dto';
import { ApiTags } from '@nestjs/swagger';
import { MarcaService } from './marca.service';

@ApiTags("Marca")
@Controller('marca')
export class MarcaController {
  constructor(private readonly MarcaService: MarcaService) {}

  @Post()
  create(@Body() createMarcaDto: CreateMarcaDto) {
    return this.MarcaService.create(createMarcaDto);
  } 

  @Get()
  findAll() {
    return this.MarcaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.MarcaService.findOneById(id);
  }

  @Put("/update/:id")
    update(@Param("id") id: string, @Body() body:UpdateMarcaDto){
        return this.MarcaService.update(id, body);
    }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.MarcaService.remove(id);
  }
}
  