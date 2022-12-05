import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Specialty } from './entities/specialty.entity';
import { SpecialtiesService } from './specialties.service';

@Module({
  imports: [TypeOrmModule.forFeature([Specialty])],
  providers: [SpecialtiesService],
  exports: [SpecialtiesService]
})
export class SpecialtiesModule {}
