import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctor } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AddressesService } from '../addresses/addresses.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    private addressesService: AddressesService
  ) {}


  async create(createDoctorDto: CreateDoctorDto) {
    await this.checkIfExists(+createDoctorDto.crm);

    const addressData = await this.addressesService.

    return 'This action adds a new doctor';
  }

  findAll() {
    return `This action returns all doctors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }

  async checkIfExists(crm: number) {
    const isAlreadyRegistered = await this.doctorsRepository.findOne({
      where: { crm }
    });

    if(isAlreadyRegistered) throw new HttpException("Médico já cadastrado", HttpStatus.CONFLICT);

    return;
    }
}
