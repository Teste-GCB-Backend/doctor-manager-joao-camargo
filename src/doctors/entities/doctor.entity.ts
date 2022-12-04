import { Entity, PrimaryGeneratedColumn, Column }  from "typeorm"

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
    address: number;
}
