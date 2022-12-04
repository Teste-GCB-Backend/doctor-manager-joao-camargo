import { Module } from '@nestjs/common';
import { SpecialtiesService } from './specialties.service';

@Module({
  providers: [SpecialtiesService],
  exports: [SpecialtiesService]
})
export class SpecialtiesModule {}
