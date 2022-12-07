import { Specialty } from "../../specialties/entities/specialty.entity";
import { Connection } from "typeorm";
import { Factory, Seeder } from "typeorm-seeding";

export class SpecialtyCreate implements Seeder {
    public async run(factory: Factory, connection: Connection): Promise<void> {

        if (await connection.getRepository(Specialty).count() > 0) return;
        
        await connection.createQueryBuilder().insert().into(Specialty).values([
            { specialty: 'Alergologia' },
            { specialty: 'Angiologia' },
            { specialty: 'Buco maxilo' },
            { specialty: 'Cardiologia clínica' },
            { specialty: 'Cardiologia infantil' },
            { specialty: 'Cirurgia cabeça e pescoço' },
            { specialty: 'Cirurgia cardíaca' },
            { specialty: 'Cirurgia de tórax' },
        ]).execute();
        
    }
}