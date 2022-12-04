import { Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne, OneToOne, Column } from "typeorm"

import { Doctor } from "../../doctors/entities/doctor.entity";
import { Specialty } from "../../specialties/entities/specialty.entity";

@Entity()
export class DoctorSpecialty { 
    @PrimaryGeneratedColumn('increment')
    id: number;
  
    @ManyToOne(type => Doctor, { cascade: true })
    @JoinColumn({ name: 'doctorId' })
    @Column({ type: 'int', select: false })
    doctorId: Doctor;
  
    @OneToOne(type => Specialty, { cascade: true, eager: true })
    @JoinColumn({name: 'specialtyId', referencedColumnName: 'id'})
    @Column({ type: 'int' })
    specialtyId: Specialty;
}
