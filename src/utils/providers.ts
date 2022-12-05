import { getRepositoryToken } from "@nestjs/typeorm";

export const repositoryProvider = (repository: any) => ( {
    provide: getRepositoryToken(repository),
    useValue: {
        findOne: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        update: jest.fn()
    }
});

export const serviceProvider = (service) => ({
    provide: service,
    useValue: {
        create: jest.fn(),
        update: jest.fn(),
        findAll: jest.fn(),
    }
    
})
