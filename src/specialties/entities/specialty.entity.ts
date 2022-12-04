import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Specialty {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 120, nullable: false})
    specialty: string;
}
