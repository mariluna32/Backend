import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { EpsService } from './eps.service';
import { CreateEpDto, UpdateEpsDto } from './dto/create-ep.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("EPS")
@Controller('eps')
export class EpsController {
  constructor(private readonly epsService: EpsService) {}

  @Post()
   create(@Body() createEpDto: CreateEpDto) {
    return this.epsService.create(createEpDto);
  }

  @Put('/eps/:id')
  update(@Param('id') id: string, @Body() body:UpdateEpsDto ){
    return this.epsService.update(id, body)
  }

  @Get()
  findAll() {
    return this.epsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.epsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.epsService.remove(id);
  }
}
