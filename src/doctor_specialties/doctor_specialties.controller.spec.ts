import { Test, TestingModule } from '@nestjs/testing';
import { DoctorSpecialtiesController } from './doctor_specialties.controller';
import { DoctorSpecialtiesService } from './doctor_specialties.service';

describe('DoctorSpecialtiesController', () => {
  let controller: DoctorSpecialtiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorSpecialtiesController],
      providers: [DoctorSpecialtiesService],
    }).compile();

    controller = module.get<DoctorSpecialtiesController>(DoctorSpecialtiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
