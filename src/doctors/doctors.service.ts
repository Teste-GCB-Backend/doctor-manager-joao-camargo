import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmQueryService } from '@nestjs-query/query-typeorm';

import { Doctors } from './entities/doctor.entity';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { AddressesService } from '../addresses/addresses.service';
import { DoctorSpecialtiesService } from '../doctor_specialties/doctor_specialties.service';
import type { Addresses } from '../addresses/entities/address.entity';

@Injectable()
export class DoctorsService extends TypeOrmQueryService<Doctors> {
  constructor(
    @InjectRepository(Doctors)
    private doctorsRepository: Repository<Doctors>,
    private addressesService: AddressesService,
    private doctorSpecialtiesService: DoctorSpecialtiesService,
  ) {
    super(doctorsRepository, { useSoftDelete: true });
  }

  async create(createDoctorDto: CreateDoctorDto) {
    await this.checkIfExists(+createDoctorDto.crm);
    const addressData = await this.addressesService.findByCep(
      +createDoctorDto.zipCode,
    );
    const newAddressEntity = this.addressesService.create(addressData);
    const newDoctor = this.newDoctorEntity(createDoctorDto, newAddressEntity);

    await this.doctorSpecialtiesService.create(
      createDoctorDto.specialties,
      newDoctor,
    );

    return 'Médico cadastrado com sucesso';
  }

  async findAll() {
    const doctors = await this.doctorsRepository.find({
      relations: [
        'addressId',
        'doctorSpecialty',
        'doctorSpecialty.specialtyId',
      ],
    });

    return this.formatDoctorData(doctors);
  }

  async findOne(id: number) {
    return await this.doctorsRepository
      .findOneOrFail({
        relations: [
          'addressId',
          'doctorSpecialty',
          'doctorSpecialty.specialtyId',
        ],
        where: { id },
      })
      .then((doctor) => {
        return this.formatDoctorData([doctor])[0];
      })
      .catch((error) => {
        throw new HttpException('Médico não encontrado', HttpStatus.NOT_FOUND);
      });
  }

  async findAllByAllColumns(search: string) {
    const doctors = await this.doctorsRepository
      .createQueryBuilder('doctors')
      .innerJoinAndSelect('doctors.addressId', 'address')
      .innerJoinAndSelect('doctors.doctorSpecialty', 'doctorSpecialty')
      .innerJoinAndSelect('doctorSpecialty.specialtyId', 'specialty')
      .where(
        'doctors.id LIKE :search OR doctors.name LIKE :search OR doctors.crm LIKE :search OR doctors.landline LIKE :search OR doctors.cellphone LIKE :search OR address.street LIKE :search OR address.number LIKE :search OR address.complement LIKE :search OR address.neighborhood LIKE :search OR address.city LIKE :search OR address.state LIKE :search OR address.zipCode LIKE :search OR specialty.specialty LIKE :search',
        { search: `%${search}%` },
      )
      .getMany();

    return this.formatDoctorData(doctors);
  }

  async findAllByFilter(filter: { key: string }) {
    try {
      const doctors = await this.doctorsRepository
        .createQueryBuilder('doctors')
        .innerJoinAndSelect('doctors.addressId', 'address')
        .innerJoinAndSelect('doctors.doctorSpecialty', 'doctorSpecialty')
        .innerJoinAndSelect('doctorSpecialty.specialtyId', 'specialty')
        .where(`${Object.keys(filter)} = :${Object.keys(filter)}`, filter)
        .getMany();

      return this.formatDoctorData(doctors);
    } catch (error) {
      throw new HttpException(
        'Parâmetro inválido de filtragem inválido',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto) {
    const findDoctor = await this.doctorsRepository.findOne({
      where: { id },
      relations: [
        'addressId',
        'doctorSpecialty',
        'doctorSpecialty.specialtyId',
      ],
    });

    if (!findDoctor)
      throw new HttpException('Médico não encontrado', HttpStatus.NOT_FOUND);

    if (findDoctor.addressId.zipCode !== +updateDoctorDto.zipCode) {
      const addressData = await this.addressesService.findByCep(
        +updateDoctorDto.zipCode,
      );
      const newAddressEntity = this.addressesService.create(addressData);
      findDoctor.addressId = newAddressEntity;
    }

    if (findDoctor.crm !== +updateDoctorDto.crm) {
      try {
        await this.checkIfExists(+updateDoctorDto.crm);
      } catch (error) {
        throw new HttpException(
          'Não é possivel cadastrar esse CRM, pois ele já está na base de dados',
          HttpStatus.CONFLICT,
        );
      }
    }

    findDoctor.name = updateDoctorDto.name;
    findDoctor.crm = +updateDoctorDto.crm;
    findDoctor.landline = +updateDoctorDto.landline;
    findDoctor.cellphone = +updateDoctorDto.cellphone;

    await this.doctorSpecialtiesService.update(updateDoctorDto, findDoctor);

    return 'Médico atualizado com sucesso';
  }

  async remove(id: number) {
    const deletedDoctor = await this.doctorsRepository.softDelete(id);

    if (deletedDoctor.raw.affectedRows === 0)
      throw new HttpException('Médico não encontrado', HttpStatus.NOT_FOUND);

    return 'Médico deletado com sucesso';
  }

  async checkIfExists(crm: number) {
    const isAlreadyRegistered = await this.doctorsRepository.findOne({
      where: { crm },
    });
    if (isAlreadyRegistered)
      throw new HttpException('Médico já cadastrado', HttpStatus.CONFLICT);

    return;
  }

  formatDoctorData(doctors: Doctors[]) {
    return doctors.map((doctor) => {
      return {
        id: doctor.id,
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
      };
    });
  }

  newDoctorEntity(createDoctorDto: CreateDoctorDto, address: Addresses) {
    const newDoctor = new Doctors({
      name: createDoctorDto.name,
      crm: +createDoctorDto.crm,
      landline: +createDoctorDto.landline,
      cellphone: +createDoctorDto.cellphone,
      addressId: address,
    });

    return newDoctor;
  }
}
