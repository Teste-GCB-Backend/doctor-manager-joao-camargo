import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn }  from "typeorm"

import { Addresses } from "../../addresses/entities/address.entity";

@Entity()
export class Doctor {
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
    @JoinColumn({name: 'address', referencedColumnName: 'id'})
    address: Addresses;
}
