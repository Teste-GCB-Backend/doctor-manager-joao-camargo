import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UpdateDoctorSpecialtyDto } from './dto/update-doctor_specialty.dto';
import { Doctors } from '../doctors/entities/doctor.entity';
import { CreateSpecialtyDto } from '../specialties/dto/create-specialty.dto';
import { DoctorSpecialty } from './entities/doctor_specialty.entity';
import { SpecialtiesService } from '../specialties/specialties.service';
import { Specialty } from '../specialties/entities/specialty.entity';
import { UpdateDoctorDto } from 'src/doctors/dto/update-doctor.dto';

@Injectable()
export class DoctorSpecialtiesService {
  constructor(
    @InjectRepository(DoctorSpecialty)
    private doctorSpecialtiesRepository: Repository<DoctorSpecialty>,
    private specialtiesService: SpecialtiesService,
  ) {}

  async create(specialty: CreateSpecialtyDto[], doctor: Doctors) {
    const filteredSpecialties = this.filterSpecialties(specialty);
    this.checkDoctorSpecialtiesLength(filteredSpecialties);
    const checkSpecialtiesExists: Specialty | any = await this.specialtiesService.find(filteredSpecialties);
    const newDoctorSpecialties = this.createNewDoctorSpecialties(checkSpecialtiesExists, doctor);

    return this.doctorSpecialtiesRepository.save(newDoctorSpecialties);
    
  }

  async update(updateDoctorDto: UpdateDoctorDto, doctor: Doctors) {
    const specialties = updateDoctorDto.specialties;
    const filteredSpecialties = this.filterSpecialties(specialties);
    this.checkDoctorSpecialtiesLength(filteredSpecialties);
    const checkSpecialtiesExists: Specialty | any = await this.specialtiesService.find(filteredSpecialties);
    const newDoctorSpecialties = this.createNewDoctorSpecialties(checkSpecialtiesExists, doctor);

    await this.doctorSpecialtiesRepository.delete({ doctorId: doctor });

    return this.doctorSpecialtiesRepository.save(newDoctorSpecialties);
  }

  filterSpecialties(specialties: CreateSpecialtyDto[]) {
    return specialties.filter(
      (specialty, i) => specialties.indexOf(specialty) === i,
    );
  }

  checkDoctorSpecialtiesLength(specialties: CreateSpecialtyDto[]) {
    if (specialties.length < 2) {
      throw new HttpException(
        'Médico deve possuir ao menos duas especialidades',
        HttpStatus.BAD_REQUEST,
      );
    }
    return;
  }

  createNewDoctorSpecialties(specialties: Specialty[], doctor: Doctors) {
    return specialties.map((specialty: Specialty) => {
      return {
        doctorId: doctor,
        specialtyId: specialty,
      }
    });
  }

}
