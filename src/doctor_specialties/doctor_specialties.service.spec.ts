import { Test, TestingModule } from '@nestjs/testing';
import { DoctorSpecialtiesService } from './doctor_specialties.service';

describe('DoctorSpecialtiesService', () => {
  let service: DoctorSpecialtiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoctorSpecialtiesService],
    }).compile();

    service = module.get<DoctorSpecialtiesService>(DoctorSpecialtiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
