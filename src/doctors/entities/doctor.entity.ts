import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, JoinColumn }  from "typeorm"

import { Addresses } from "../../addresses/entities/address.entity";
import { DoctorSpecialty } from "../../doctor_specialties/entities/doctor_specialty.entity";

@Entity()
export class Doctors {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 120, nullable: false})
    name: string;

    @Column({type: 'int', width: 7, unique: true, nullable: false})
    crm: number;

    @Column({ type: 'varchar', length: 10, nullable: false })
    landline: number;

    @Column({ type: 'varchar', length: 11, nullable: false })
    cellphone: number;

    @Column({ type: 'int', nullable: false, unique: true, select: false })
    @OneToOne(type => Addresses, {cascade: true, eager: true})
    @JoinColumn({name: 'addressId', referencedColumnName: 'id'})
    addressId: Addresses;

    @OneToMany(type => DoctorSpecialty, doctorSpecialty => doctorSpecialty.doctorId)
    doctorSpecialty: DoctorSpecialty[];
}
