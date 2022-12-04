import { Entity, PrimaryGeneratedColumn, Column }  from "typeorm"

@Entity()
export class Addresses {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', length: 250, nullable: false })
    street: string;

    @Column({ type: 'int', nullable: false })
    number: number;

    @Column({ type: 'text', nullable: true })
    complement: string;

    @Column({ type: 'text', nullable: false })
    neighborhood: string;

    @Column({ type: 'text', nullable: false })
    city: string;

    @Column({ type: 'text', nullable: false })
    state: string;

    @Column({ type: 'int', width: 8, nullable: false })
    zipCode: number;

}
