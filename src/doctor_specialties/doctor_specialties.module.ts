import { Module } from '@nestjs/common';
import { DoctorSpecialtiesService } from './doctor_specialties.service';

@Module({
  providers: [DoctorSpecialtiesService]
})
export class DoctorSpecialtiesModule {}
