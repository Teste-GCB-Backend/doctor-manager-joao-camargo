import { faker } from "@faker-js/faker"

import { CreateDoctorDto } from '../../src/doctors/dto/create-doctor.dto';

export function createFakeDoctor(): CreateDoctorDto | any {
    return {
        name: faker.random.alpha(5),
        crm: +faker.random.numeric(7),
        phone: +faker.random.numeric(10),
        cellphone: +faker.random.numeric(11),
        zipCode: +"01311000",
        specialties: ["Cardiologia infantil", "Cirurgia de tórax"]
    };
}

export function createFakeDoctorWithDoctorDto() {
    const doctor = createFakeDoctor();
    
    return {
        ...doctor,
        crm: doctor.crm.toString(),
        landline: doctor.phone.toString(),
        cellphone: doctor.cellphone.toString(),
        zipCode: `0${doctor.zipCode}`,
    }
    
}