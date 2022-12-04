import { IsArray, IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class CreateDoctorDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 120)
    name: string;

    @IsNotEmpty()
    @IsNumberString()  
    @Length(7, 7)
    crm: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(10, 10)
    phone: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(11, 11)
    cellphone: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(8, 8)
    zipCode: string;

    @IsNotEmpty()
    @IsArray()
    specialties: string[];
}