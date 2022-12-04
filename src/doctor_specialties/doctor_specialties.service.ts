import { Injectable } from '@nestjs/common';

import { CreateDoctorSpecialtyDto } from './dto/create-doctor_specialty.dto';
import { UpdateDoctorSpecialtyDto } from './dto/update-doctor_specialty.dto';
import { Doctor } from '../doctors/entities/doctor.entity';
import { CreateSpecialtyDto } from '../specialties/dto/create-specialty.dto';

@Injectable()
export class DoctorSpecialtiesService {
  create(specialty: CreateSpecialtyDto[], doctor: Doctor) {
    const filteredSpecialties = this.filterSpecialties(specialty);
  }

  findAll() {
    return `This action returns all doctorSpecialties`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorSpecialty`;
  }

  update(id: number, updateDoctorSpecialtyDto: UpdateDoctorSpecialtyDto) {
    return `This action updates a #${id} doctorSpecialty`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorSpecialty`;
  }

  filterSpecialties(specialties: CreateSpecialtyDto[]) {
    return specialties.filter(
      (specialty, i) => specialties.indexOf(specialty) === i,
    );
  }
}
