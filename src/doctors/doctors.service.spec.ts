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

    it('should throw an exception', () => {
      jest
        .spyOn(doctorSpecialtiesService, 'create')
        .mockRejectedValueOnce(new Error());

      expect(doctorService.create).rejects.toThrowError();
    });
  });
});
