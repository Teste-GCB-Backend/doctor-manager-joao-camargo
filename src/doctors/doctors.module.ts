import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { Doctors } from './entities/doctor.entity';
import { AddressesModule } from '../addresses/addresses.module';
import { DoctorSpecialtiesModule } from '../doctor_specialties/doctor_specialties.module';

@Module({
  imports: [TypeOrmModule.forFeature([Doctors]), AddressesModule, DoctorSpecialtiesModule],
  controllers: [DoctorsController],
  providers: [DoctorsService]
})
export class DoctorsModule {}
