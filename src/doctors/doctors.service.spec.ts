import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { repositoryProvider, serviceProvider } from '../utils/providers';
import { DoctorsService } from './doctors.service';
import { AddressesService } from '../addresses/addresses.service';
import { Doctors } from './entities/doctor.entity';
import { DoctorSpecialtiesService } from '../doctor_specialties/doctor_specialties.service';
import { createFakeDoctor } from '../../test/factories/doctor.factory';
import addressFactory from '../../test/factories/address.factory';
import { HttpException } from '@nestjs/common';

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
      doctorRepository.findOneOrFail = jest.fn().mockResolvedValueOnce(doctor);
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

  describe('update', () => {
    it('should be defined', () => {
      expect(doctorService.update).toBeDefined();
    });

    it('should update a doctor entity successfully', async () => {
      const createdDoctor = await createFakeDoctor();

      jest.spyOn(doctorRepository, 'findOne').mockImplementationOnce(() =>
        Promise.resolve({
          ...createdDoctor,
          addressId: {
            zipCode: createdDoctor.zipCode,
          },
        }),
      );

      addressesService.create = jest.fn().mockReturnValueOnce(null);

      const spy = new DoctorsService(
        doctorRepository,
        addressesService,
        doctorSpecialtiesService,
      );

      const result = await doctorService.update(1, createdDoctor);

      expect(result).toEqual('Médico atualizado com sucesso');
      expect(doctorSpecialtiesService.update).toHaveBeenCalledTimes(1);
      expect(addressesService.create(createdDoctor)).toBe(null);
    });

    it('should throw an exception if doctor does not exist', async () => {
      jest
        .spyOn(doctorRepository, 'findOne')
        .mockImplementationOnce(() => Promise.resolve(null));

      await doctorService
        .update(1, await createFakeDoctor())
        .catch((e) => {
          expect(e).toBeInstanceOf(HttpException);
        })
        .then((data) => {
          expect(data).toBeUndefined();
        });
    });

    it('should create new address entity if zipCode is different', async () => {
      const createdDoctor = await createFakeDoctor();
      const address = addressFactory.newAddressEntity();

      jest.spyOn(doctorRepository, 'findOne').mockImplementationOnce(() =>
        Promise.resolve({
          ...createdDoctor,
          addressId: {
            zipCode: '12345678',
          },
        }),
      );

      addressesService.create = jest.fn().mockReturnValueOnce(null);

      addressesService.findByCep = jest.fn().mockResolvedValueOnce(address);

      const spy = new DoctorsService(
        doctorRepository,
        addressesService,
        doctorSpecialtiesService,
      );


      const result = await doctorService.update(1, createdDoctor);

      expect(result).toEqual('Médico atualizado com sucesso');
      expect(doctorSpecialtiesService.update).toHaveBeenCalledTimes(1);
      expect(addressesService.create(createdDoctor)).toBe(undefined);
      expect(addressesService.findByCep).toHaveBeenCalledTimes(1);
    });

    it('should update doctor crm if it is different', async () => {
      const createdDoctor = await createFakeDoctor();

      jest.spyOn(doctorRepository, 'findOne').mockImplementationOnce(() =>
        Promise.resolve({
          ...createdDoctor,
          addressId: {
            zipCode: createdDoctor.zipCode,
          },
          crm: '123456',
        }),
      );

      addressesService.create = jest.fn().mockReturnValueOnce(null);

      const spy = new DoctorsService(
        doctorRepository,
        addressesService,
        doctorSpecialtiesService,
      );
      
      jest.spyOn(spy, 'checkIfExists').mockReturnValueOnce(null);

      const result = await doctorService.update(1, createdDoctor);

      expect(result).toEqual('Médico atualizado com sucesso');
      expect(doctorSpecialtiesService.update).toHaveBeenCalledTimes(1);
      expect(addressesService.create(createdDoctor)).toBe(null);
      expect(spy.checkIfExists(createdDoctor)).toBe(null);
    });

    it('should throw an exception if doctor crm is already in use', async () => {
      const createdDoctor = await createFakeDoctor();

      jest.spyOn(doctorRepository, 'findOne').mockImplementationOnce(() =>
        Promise.resolve({
          ...createdDoctor,
          addressId: {
            zipCode: createdDoctor.zipCode,
          },
          crm: '123456',
        }),
      );

      addressesService.create = jest.fn().mockResolvedValueOnce(null)

      const spy = new DoctorsService(
        doctorRepository,
        addressesService,
        doctorSpecialtiesService,
      );
    
      jest.spyOn(spy, 'checkIfExists').mockRejectedValueOnce(new Error());

      await spy
        .update(1, createdDoctor)
        .catch((e) => {
          expect(e).toBeInstanceOf(HttpException);
        })
        .then((data) => {
          expect(data).toBeUndefined();
        });
    });
  });

  describe('delete', () => {
    it('should be defined', () => {
      expect(doctorService.remove).toBeDefined();
    });

    it('should soft delete a doctor entity successfully', async () => {
      doctorRepository.softDelete = jest.fn().mockResolvedValueOnce({
        raw: {
          affectedRows: 1,
        }
      });

      const result = await doctorService.remove(1);

      expect(result).toEqual('Médico deletado com sucesso');
    });

    it('should throw an exception if doctor does not exist', async () => {
      doctorRepository.update = jest.fn().mockResolvedValueOnce({
        affected: 0,
      });

      await doctorService
        .remove(1)
        .catch((e) => {
          expect(e).toBeInstanceOf(TypeError);
        })
        .then((data) => {
          expect(data).toBeUndefined();
        });
    });
  });

  describe('checkIfDoctorExists', () => {
    it('should be defined', () => {
      expect(doctorService.checkIfExists).toBeDefined();
    });

    it('should return null if the doctor does not exist', async () => {
      const doctor = await createFakeDoctor();

      jest.spyOn(doctorRepository, 'findOne').mockResolvedValueOnce(null);

      const result = await doctorService.checkIfExists(doctor);

      expect(result).toBe(undefined);
      expect(doctorRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if doctor already exists', () => {
      jest
        .spyOn(doctorRepository, 'findOne')
        .mockImplementationOnce(() => createFakeDoctor());

      expect(doctorService.checkIfExists(createFakeDoctor())).rejects.toThrow(
        'Médico já cadastrado',
      );
    });
  });
});
