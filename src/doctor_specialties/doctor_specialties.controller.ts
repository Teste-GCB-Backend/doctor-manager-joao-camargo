import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorSpecialtiesService } from './doctor_specialties.service';
import { CreateDoctorSpecialtyDto } from './dto/create-doctor_specialty.dto';
import { UpdateDoctorSpecialtyDto } from './dto/update-doctor_specialty.dto';

@Controller('doctor-specialties')
export class DoctorSpecialtiesController {
  constructor(private readonly doctorSpecialtiesService: DoctorSpecialtiesService) {}

  @Post()
  create(@Body() createDoctorSpecialtyDto: CreateDoctorSpecialtyDto) {
    return this.doctorSpecialtiesService.create(createDoctorSpecialtyDto);
  }

  @Get()
  findAll() {
    return this.doctorSpecialtiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorSpecialtiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorSpecialtyDto: UpdateDoctorSpecialtyDto) {
    return this.doctorSpecialtiesService.update(+id, updateDoctorSpecialtyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorSpecialtiesService.remove(+id);
  }
}
