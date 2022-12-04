import { Table } from "typeorm";
import {MigrationInterface, QueryRunner} from "typeorm";

export class Create1670163590294 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createDatabase('practice-gcb-joao-camargo', true)
        await queryRunner.createTable(new Table({
            name: "doctors",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "120",
                    isNullable: false
                },
                {
                    name: "crm",
                    type: "int",
                    width: 7,
                    isUnique: true,
                    isNullable: false
                },
                {
                    name: "phone",
                    type: "varchar",
                    length: "10",
                    isNullable: false
                },
                {
                    name: "cellphone",
                    type: "varchar",
                    length: "11",
                    isNullable: false
                },
                {
                    name: "addressId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "specialityId",
                    type: "int",
                    isNullable: false,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "now()"
                }
            ],
        }))
        }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropDatabase('practice-gcb-joao-camargo', true)
        await queryRunner.dropTable('doctors');
    }

}
