import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne, Column } from "typeorm"

import { Doctors } from "../../doctors/entities/doctor.entity";
import { Specialty } from "../../specialties/entities/specialty.entity";

@Entity({name: 'doctors_specialties'})
export class DoctorSpecialty { 
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @ManyToOne(type => Doctors, { cascade: true, eager: true })
    @JoinColumn({ name: 'doctorId' })
    @Column({ type: 'int', select: false })
    doctorId: Doctors;

    @OneToOne(type => Specialty, { cascade: true, eager: true })
    @JoinColumn({name: 'specialtyId', referencedColumnName: 'id'})
    specialtyId: Specialty;
}
