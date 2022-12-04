import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateDoctorsSpecialtiesTable1668380978544 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'doctors_specialties',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'doctorId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'specialtyId',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],


            }
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('doctors_specialties')
    }

}
