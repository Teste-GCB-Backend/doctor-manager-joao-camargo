import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { repositoryProvider, serviceProvider } from '../utils/providers';
import { DoctorsService } from './doctors.service';
import { AddressesService } from '../addresses/addresses.service';
import { Doctors } from './entities/doctor.entity';
import { DoctorSpecialtiesService } from '../doctor_specialties/doctor_specialties.service';
import { createFakeDoctor } from '../../test/factories/doctor.factory';
import addressFactory from '../../test/factories/address.factory';

describe('DoctorsService', () => {
  let doctorService: DoctorsService;
  let addressesService: AddressesService;
  let doctorSpecialtiesService: DoctorSpecialtiesService;
  let doctorRepository: Repository<Doctors>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorsService,
        repositoryProvider(Doctors),
        serviceProvider(AddressesService),
        serviceProvider(DoctorSpecialtiesService),
      ],
    }).compile();

    doctorService = module.get<DoctorsService>(DoctorsService);
    doctorRepository = module.get<Repository<Doctors>>('DoctorsRepository');
    addressesService = module.get<AddressesService>(AddressesService);
    doctorSpecialtiesService = module.get<DoctorSpecialtiesService>(
      DoctorSpecialtiesService,
    );
  });

  it('should be defined', () => {
    expect(doctorService).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(doctorService.create).toBeDefined();
    });

    it('should create a new doctor entity successfully', async () => {

      addressesService.findByCep = jest
        .fn()
        .mockImplementationOnce(() =>
          Promise.resolve(addressFactory.newAddressResponseViaCep()),
      );
      
      const spy = new DoctorsService(
        doctorRepository,
        addressesService,
        doctorSpecialtiesService,
      );

      const createdDoctor = await createFakeDoctor();
      const result = await doctorService.create(createdDoctor);

      jest.spyOn(spy, 'checkIfExists').mockReturnValueOnce(null);
      jest.spyOn(addressesService, 'create').mockReturnValueOnce(null);
      jest.spyOn(spy, 'newDoctorEntity').mockReturnValueOnce(null);

      expect(result).toEqual('Médico cadastrado com sucesso');
      expect(doctorSpecialtiesService.create).toHaveBeenCalledTimes(1);
      expect(spy.checkIfExists(createdDoctor)).toBe(null);
      expect(
        spy.newDoctorEntity(createdDoctor, addressFactory.newAddressEntity()),
      ).toBe(null);
    });

    it('should throw an error if the doctor already exists', async () => {
      const createdDoctor = await createFakeDoctor();
      const spy = new DoctorsService(
        doctorRepository,
        addressesService,
        doctorSpecialtiesService,
      );

      jest.spyOn(spy, 'checkIfExists').mockRejectedValueOnce(new Error())

      await expect(doctorService.create(createdDoctor)).rejects.toThrowError();
    });

    it('should throw an exception', () => {
      jest
        .spyOn(doctorSpecialtiesService, 'create')
        .mockRejectedValueOnce(new Error());

      expect(doctorService.create).rejects.toThrowError();
    });
  });

  describe('findOne', () => {
   
    it('should be defined', () => {
      expect(doctorService.findOne).toBeDefined();
    });
      
    it('should return a doctor entity', async () => {
      const doctor = await createFakeDoctor();
      const spy = new DoctorsService(
        doctorRepository,
        addressesService,
        doctorSpecialtiesService,
      );
      doctor.doctorSpecialty = [{ specialtyId: doctor.specialties[0] }, { specialtyId: doctor.specialties[1] }]
      doctor.addressId = addressFactory.newAddressEntity();
      
      jest.spyOn(spy, 'checkIfExists').mockReturnValueOnce(doctor);
      jest.spyOn(doctorRepository, 'findOne').mockReturnValueOnce(doctor);

      const result = await doctorService.findOne(doctor.id);
      
      expect(result.crm).toEqual(doctor.crm);
      expect(result.name).toEqual(doctor.name);
      expect(result.street).toEqual(doctor.addressId.street);
      expect(result.city).toEqual(doctor.addressId.city);
      expect(result.state).toEqual(doctor.addressId.state);
    });
    
    it('should throw an error', async () => {
      doctorRepository.findOne = jest.fn().mockRejectedValueOnce(new Error());

      await expect(doctorService.findOne(1234)).rejects.toThrowError();
    });
  })

  describe('findAll', () => {

    it('should be defined', () => {
      expect(doctorService.findAll).toBeDefined();
    });

    it('should return an array of doctors', async () => {
      const doctor = await createFakeDoctor();
      doctorRepository.find = jest.fn().mockReturnValueOnce([doctor]);

      const spy = new DoctorsService(
        doctorRepository,
        addressesService,
        doctorSpecialtiesService,
      );

      doctor.doctorSpecialty = [{ specialtyId: doctor.specialties[0] }, { specialtyId: doctor.specialties[1] }]
      doctor.addressId = addressFactory.newAddressEntity();

      const result = await doctorService.findAll();

      expect(result[0].name).toEqual(doctor.name);
      expect(result[0].crm).toEqual(doctor.crm);
      expect(result[0].street).toEqual(doctor.addressId.street);
      expect(result[0].city).toEqual(doctor.addressId.city);
      expect(result[0].state).toEqual(doctor.addressId.state);
    });

    it('should throw an error', async () => {
      doctorRepository.find = jest.fn().mockRejectedValueOnce(new Error());

      await expect(doctorService.findAll()).rejects.toThrowError();
    });
  });

  describe("findAllByAllColumns", () => {

    it('should be defined', () => {
      expect(doctorService.findAllByAllColumns).toBeDefined();
    });

    it('should return an array of doctors', async () => {
      const doctor = await createFakeDoctor();
      doctorRepository.createQueryBuilder = jest
        .fn()
        .mockImplementation(() => ({
          innerJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue([doctor]),
        }));

      const spy = new DoctorsService(
        doctorRepository,
        addressesService,
        doctorSpecialtiesService,
      );

      doctor.doctorSpecialty = [{ specialtyId: doctor.specialties[0] }, { specialtyId: doctor.specialties[1] }]
      doctor.addressId = addressFactory.newAddressEntity();

      const result = await spy.findAllByAllColumns('1234');

      expect(result[0].name).toEqual(doctor.name);
      expect(result[0].crm).toEqual(doctor.crm);
      expect(result[0].street).toEqual(doctor.addressId.street);
      expect(result[0].city).toEqual(doctor.addressId.city);
      expect(result[0].state).toEqual(doctor.addressId.state);
    });

    it('should throw an error', async () => {
      doctorRepository.createQueryBuilder = jest
        .fn()
        .mockImplementation(() => ({
          innerJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(new Error()),
        }));
      
      doctorService.formatDoctorData = jest.fn().mockReturnValueOnce(null);

      await doctorService.findAllByAllColumns('123').then(() => {
        expect(doctorService.formatDoctorData).toHaveBeenCalled();
      }).catch(() => {
      expect(doctorService.findAllByAllColumns('123')).rejects.toThrowError();
    });
    });
  });

  describe("findAllByFilter", () => {

    it('should be defined', () => {
      expect(doctorService.findAllByFilter).toBeDefined();
    });

    it('should return an array of doctors', async () => {
      const doctor = await createFakeDoctor();
      doctorRepository.createQueryBuilder = jest
        .fn()
        .mockImplementation(() => ({
          innerJoinAndSelect: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue([doctor]),
        }));

      const spy = new DoctorsService(
        doctorRepository,
        addressesService,
        doctorSpecialtiesService,
      );

      doctor.doctorSpecialty = [{ specialtyId: doctor.specialties[0] }, { specialtyId: doctor.specialties[1] }]
      doctor.addressId = addressFactory.newAddressEntity();

      const result = await spy.findAllByFilter({key: "1"});

      expect(result[0].name).toEqual(doctor.name);
      expect(result[0].crm).toEqual(doctor.crm);
      expect(result[0].street).toEqual(doctor.addressId.street);
      expect(result[0].city).toEqual(doctor.addressId.city);
      expect(result[0].state).toEqual(doctor.addressId.state);
    });
  });
});
