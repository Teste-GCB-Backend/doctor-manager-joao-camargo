import {MigrationInterface, QueryRunner} from "typeorm";

export class ForeignKey1668379780281 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE doctors
        ADD CONSTRAINT fk_adresses_doctors
        FOREIGN KEY address_doctor(addressId)
        REFERENCES address(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE doctors
        DROP CONSTRAINT fk_adresses_doctors;`);
    }

}
