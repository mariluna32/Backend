import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TipoInformeService } from './tipo-informe.service';
import { CreateTipoInformeDTO, UpdateTipoInformeDTO } from './dto/tipo-informe.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Tipo de Informe")
@Controller('tipo-informe')
export class TipoInformeController {
    constructor(private readonly tipoInformeService: TipoInformeService) {}

    @Post()
    create(@Body() createTipoInformeDTO: CreateTipoInformeDTO) {
        return this.tipoInformeService.create(createTipoInformeDTO);
    }

    @Get()
    findAll() {
        return this.tipoInformeService.findAll();
    }

    @Get('/numero/:id')
    getNumero(@Param('id') id: string){
      return this.tipoInformeService.getNumero(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTipoInformeDTO: UpdateTipoInformeDTO) {
      return this.tipoInformeService.update(id, updateTipoInformeDTO);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.tipoInformeService.delete(id);
    }

}
