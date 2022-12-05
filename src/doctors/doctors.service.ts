import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Doctors } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AddressesService } from '../addresses/addresses.service';
import { DoctorSpecialtiesService } from '../doctor_specialties/doctor_specialties.service';
import type { Addresses } from '../addresses/entities/address.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctors)
    private doctorsRepository: Repository<Doctors>,
    private addressesService: AddressesService,
    private doctorSpecialtiesService: DoctorSpecialtiesService
  ) {}


  async create(createDoctorDto: CreateDoctorDto) {
    await this.checkIfExists(+createDoctorDto.crm);

    const addressData = await this.addressesService.findByCep(+createDoctorDto.zipCode);
    const newAddressEntity = this.addressesService.create(addressData);
    const newDoctor = this.newDoctorEntity(createDoctorDto, newAddressEntity);

    await this.doctorSpecialtiesService.create(createDoctorDto.specialties, newDoctor);

    return 'Médico cadastrado com sucesso';
  }

  async findAll() {
    const doctors = await this.doctorsRepository.find({
      relations: ['addressId', 'doctorSpecialty', 'doctorSpecialty.specialtyId']
    });

    return this.formatDoctorData(doctors);
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

  formatDoctorData(doctors: Doctors[]) {
    return doctors.map(doctor => {
      return {
        name: doctor.name,
        crm: doctor.crm,
        landline: doctor.landline,
        cellphone: doctor.cellphone,
        specialties: doctor.doctorSpecialty.map((specialty) => {
          return specialty.specialtyId.specialty;
        }),
        street: doctor.addressId.street,
        number: doctor.addressId.number,
        complement: doctor.addressId.complement,
        neighborhood: doctor.addressId.neighborhood,
        city: doctor.addressId.city,
        state: doctor.addressId.state,
        zipCode: doctor.addressId.zipCode,
      }
    })
  }
  
  newDoctorEntity(createDoctorDto: CreateDoctorDto, address: Addresses) {
    const newDoctor = new Doctors();
    newDoctor.name = createDoctorDto.name;
    newDoctor.crm = +createDoctorDto.crm;
    newDoctor.landline = +createDoctorDto.landline;
    newDoctor.cellphone = +createDoctorDto.cellphone;
    newDoctor.addressId = address;

    return newDoctor;
  }
}
