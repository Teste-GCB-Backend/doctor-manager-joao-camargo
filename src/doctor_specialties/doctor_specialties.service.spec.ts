import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { createFakeDoctor } from '../../test/factories/doctor.factory';
import { Doctors } from '../doctors/entities/doctor.entity';
import { SpecialtiesService } from '../specialties/specialties.service';
import { repositoryProvider, serviceProvider } from '../utils/providers';
import { DoctorSpecialtiesService } from './doctor_specialties.service';
import { DoctorSpecialty } from './entities/doctor_specialty.entity';

describe('DoctorSpecialtiesService', () => {
  let service: DoctorSpecialtiesService;
  let specialtiesService: SpecialtiesService;
  let doctorSpecialtyRepository: Repository<DoctorSpecialty>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorSpecialtiesService,
        repositoryProvider(DoctorSpecialty),
        serviceProvider(SpecialtiesService),
      ],
    }).compile();

    service = module.get<DoctorSpecialtiesService>(DoctorSpecialtiesService);
    specialtiesService = module.get<SpecialtiesService>(SpecialtiesService);
    doctorSpecialtyRepository = module.get<Repository<DoctorSpecialty>>(
      'DoctorSpecialtyRepository',
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should be defined', () => {
      expect(service.create).toBeDefined();
    });

    it('should create a new doctor specialty entity successfully', async () => {
      const doctor = new Doctors();
      const fakeDoctor = await createFakeDoctor();
      const specialty = fakeDoctor.specialties;
      specialtiesService.find = jest
        .fn()
        .mockImplementationOnce(() => Promise.resolve(specialty));

      jest
        .spyOn(doctorSpecialtyRepository, 'save')
        .mockImplementationOnce(() => specialty);

      const result = await service.create(specialty, doctor);

      expect(result).toEqual(specialty);
      expect(doctorSpecialtyRepository.save).toBeCalledTimes(1);
    });

    it('should throw an error if the doctor has less than 2 specialties', async () => {
      const doctor = new Doctors();
      const fakeDoctor = await createFakeDoctor();
      const specialty = fakeDoctor.specialties;
      const specialties = specialty.slice(0, 1);

      specialtiesService.find = jest.fn().mockImplementationOnce(() => {
        specialty;
      });

      const spy = new DoctorSpecialtiesService(
        doctorSpecialtyRepository,
        specialtiesService,
      );

      try {
        await spy.create(specialties, doctor);
      } catch (error) {
        expect(error.message).toEqual(
          'Médico deve possuir ao menos duas especialidades',
        );
      }
    });

    it('should throw an error if specialty does not exists', async () => {
      const doctor = new Doctors();
      const fakeDoctor = await createFakeDoctor();
      const specialties = fakeDoctor.specialties;

      specialtiesService.find = jest
        .fn()
        .mockImplementationOnce(() => new Error('Especialidade não existe'));

      const spy = new DoctorSpecialtiesService(
        doctorSpecialtyRepository,
        specialtiesService,
      );

      jest
        .spyOn(spy, 'createNewDoctorSpecialties')
        .mockImplementationOnce(() => {
          return specialties;
        });

      try {
        const result = await spy.create(specialties, doctor);

        expect(result).toBeUndefined();
      } catch (error) {
        expect(error.message).toEqual('Especialidade não existe');
      }
    });
  });
});
