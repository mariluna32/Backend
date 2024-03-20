import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JornadaService } from './jornada.service';
import { CreateJornadaDto } from './dto/create-jornada.dto';
import { UpdateJornadaDto } from './dto/update-jornada.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Jornada")
@Controller('jornada')
export class JornadaController {
  constructor(private readonly jornadaService: JornadaService) {}

  @Post()
  create(@Body() createJornadaDto: CreateJornadaDto) {
    return this.jornadaService.create(createJornadaDto);
  }

  @Get()
  findAll() {
    return this.jornadaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jornadaService.findOneById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJornadaDto: UpdateJornadaDto) {
    return this.jornadaService.update(id,updateJornadaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jornadaService.delete(id);
  }
}
