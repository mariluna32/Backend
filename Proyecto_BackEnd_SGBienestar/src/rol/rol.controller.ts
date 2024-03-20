/*eslint-disable */
import { Body, Controller, Get, Param, Post, Delete, Put } from '@nestjs/common';
import { RolService } from './rol.service';
import { RolDto, UpdateRolDtO } from './dto/rol.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Rol")
@Controller('rol')
export class RolController {
  constructor(private readonly RolService: RolService) {}

  @Get()
  findAll() {
    return this.RolService.findAll();
  }

  @Get(':id')
  findeOneById(@Param('id') id?: string) {
    return this.RolService.findOneById(id);
  }

  @Post()
  async create(@Body() body: RolDto) {
    return await this.RolService.create(body);
  }

  @Delete(':id')
   delete(@Param('id') id: string) {
    return this.RolService.delete(id);
  }

 @Put(":id")
  update(@Param("id") id: string, @Body() body: UpdateRolDtO){
  return this.RolService.update(id,body)
 }
}
