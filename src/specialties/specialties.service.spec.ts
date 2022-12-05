import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

import { createFakeDoctor } from '../../test/factories/doctor.factory';
import { repositoryProvider } from '../utils/providers';
import { Specialty } from './entities/specialty.entity';
import { SpecialtiesService } from './specialties.service';

describe('SpecialtiesService', () => {
  let service: SpecialtiesService;
  let specialtyRepository: Repository<Specialty>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpecialtiesService,
      repositoryProvider(Specialty)],
    }).compile();

    service = module.get<SpecialtiesService>(SpecialtiesService);
    specialtyRepository = module.get<Repository<Specialty>>('SpecialtyRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {

    it('should be defined', () => {
      expect(service.find).toBeDefined();
    });
      
    it('should return an array of specialty', async () => {
      const specialty = await createFakeDoctor().specialties;
      specialtyRepository.createQueryBuilder = jest
        .fn()
        .mockImplementation(() => ({
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(specialty),
        }));
      
      const spy = new SpecialtiesService(specialtyRepository);

      const result = await spy.find(specialty);

      expect(result).toEqual(specialty);
    });

    it('should throw an error if the specialty does not exist', async () => {

      const specialty = await createFakeDoctor().specialties;
      specialtyRepository.createQueryBuilder = jest
        .fn()
        .mockImplementation(() => ({
          where: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue([]),
        }));
      
      const spy = new SpecialtiesService(specialtyRepository);

      try {
        await spy.find(specialty);
      } catch (error) {
        expect(error.message).toEqual('Verifique se as especialidades informadas estão corretas');
      }
    });
  });

});
