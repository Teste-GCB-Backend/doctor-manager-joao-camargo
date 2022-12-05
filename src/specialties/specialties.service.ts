import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Specialty } from './entities/specialty.entity';
import { CreateSpecialtyDto } from './dto/create-specialty.dto';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Specialty)
    private specialtiesRepository: Repository<Specialty>,
  ) {}

  async find(specialties: CreateSpecialtyDto[]) {
    const specialtiesArr = await this.specialtiesRepository
      .createQueryBuilder('specialties')
      .where('specialties.specialty IN (:...specialties)', {
        specialties: specialties,
      })
      .getMany();
    
    if (specialtiesArr.length !== specialties.length) {
      throw new HttpException(
        'Verifique se as especialidades informadas estão corretas',
        HttpStatus.BAD_REQUEST,
      );
    }

    return specialtiesArr;
  }

  findOne(id: number) {
    return `This action returns a #${id} specialty`;
  }

  update(id: number, updateSpecialtyDto: UpdateSpecialtyDto) {
    return `This action updates a #${id} specialty`;
  }

  remove(id: number) {
    return `This action removes a #${id} specialty`;
  }
}
