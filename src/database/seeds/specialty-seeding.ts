import { Specialty } from "../../specialties/entities/specialty.entity";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export class SpecialtyCreate implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {
        await connection.createQueryBuilder().delete().from(Specialty).execute();
        await connection.createQueryBuilder().insert().into(Specialty).values([
            { specialty: 'Alergologia' },
            { specialty: 'Angiologia' },
            { specialty: 'Buco maxilo' },
            { specialty: 'Cardiologia clínca' },
            { specialty: 'Cardiologia infantil' },
            { specialty: 'Cirurgia cabeça e pescoço' },
            { specialty: 'Cirurgia cardíaca' },
            { specialty: 'Cirurgia de tórax' },
        ]).execute();
        
    }
}