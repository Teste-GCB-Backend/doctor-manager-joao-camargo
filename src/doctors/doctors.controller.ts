import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiFoundResponse, ApiOperation, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { FilterDoctor } from './dto/filter-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @ApiCreatedResponse({
    type: CreateDoctorDto,
  })
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @ApiOperation({
    description: "Retorna os médicos que atendem ao filtro, sendo possível usar apenas UM filtro por vez."
  })
  @Get('filter')
  async findByFilter(@Query() query: FilterDoctor) {
    return this.doctorsService.findAllByFilter(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(+id);
  }

  @ApiOperation({
    description: "Retorna os médicos que contenham, em parte ou por completo, alguma coluna salva com o parametro de busca. Exemplo: /search/João retorna todos os médicos que possuem João em alguma coluna."
  })
  @Get('search/:search')
  findAllByAllColumns(@Param('search') search: string) {
    return this.doctorsService.findAllByAllColumns(search);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(+id);
  }
}
