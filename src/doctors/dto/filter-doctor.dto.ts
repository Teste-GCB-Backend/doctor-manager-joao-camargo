import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class FilterDoctor {
    @ApiPropertyOptional()
    name: string;

    @ApiPropertyOptional()
    crm: string;

    @ApiPropertyOptional()
    landline: string;

    @ApiPropertyOptional()
    cellphone: string;

    @ApiPropertyOptional()
    street: string;

    @ApiPropertyOptional()
    neighborhood: string;

    @ApiPropertyOptional()
    city: string;

    @ApiPropertyOptional()
    state: string;

    @ApiPropertyOptional()
    zipCode: string;

    @ApiPropertyOptional()
    specialty: string;

}