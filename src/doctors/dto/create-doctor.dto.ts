import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

import { CreateSpecialtyDto } from '../../specialties/dto/create-specialty.dto';

export class CreateDoctorDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(3, 120)
    name: string;

    @ApiProperty({
        example: '1234567',
        description: 'CRM do médico contendo 7 dígitos, sem pontos ou traços',
    })
    @IsNotEmpty()
    @IsNumberString()  
    @Length(7, 7)
    crm: string;

    @ApiProperty({
        example: '1234567890',
        description: 'Telefone fixo do médico contendo 10 dígitos, sem pontos ou traços',
    })
    @IsNotEmpty()
    @IsNumberString()
    @Length(10, 10)
    landline: string;

    @ApiProperty({
        example: '11987654321',
        description: 'Celular do médico contendo 11 dígitos, sem pontos ou traços',
    })
    @IsNotEmpty()
    @IsNumberString()
    @Length(11, 11)
    cellphone: string;

    @ApiProperty({
        example: '01310100',
        description: 'CEP do médico contendo 8 dígitos, sem pontos ou traços',
    })
    @IsNotEmpty()
    @IsNumberString()
    @Length(8, 8)
    zipCode: string;

    @ApiProperty({
        type: [CreateSpecialtyDto],
        description: 'Lista de especialidades do médico, contendo no mínimo 2',
        enum: ["Alergologia", "Angiologia", "Buco maxilo", "Cardiologia clínica", "Cardiologia infantil", "Cirurgia cabeça e pescoço", "Cirurgia cardíaca", "Cirurgia de tórax"],
        exclusiveMinimum: true,
        minItems: 2,
        example: ["Alergologia", "Angiologia"],
    })
    @IsNotEmpty()
    @IsArray()
    @Type(() => CreateSpecialtyDto)
    specialties: CreateSpecialtyDto[];
}
