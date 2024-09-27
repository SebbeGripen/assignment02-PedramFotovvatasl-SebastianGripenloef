import { faker } from "@faker-js/faker";

export const generateRandomCustomerPayload = () => {
    return {
        username: faker.internet.userName(),
        name: faker.person.fullName(),
        address:faker.location.streetAddress(),
        email:faker.internet.exampleEmail(),
        phoneNumber:faker.phone.number({ style: 'international' }),
    }
}

export const generateRandomCarPayload = () => {
    return {
        pricePerDay: faker.number.float({ min: 100, max: 1000, fractionDigits: 1, }),
        fabric: faker.vehicle.color(),
        model: faker.vehicle.vehicle(),
        registrationNumber: faker.vehicle.vrm(),
    }
}

export const generateupdatedCustomer = () => {
    return {
        username: faker.internet.userName(),
        name: faker.person.fullName(),
        address:faker.location.streetAddress(),
        email:faker.internet.exampleEmail(),
        phoneNumber:faker.phone.number({ style: 'international' }),
    }
}

export const getCustomerById = (customerId) => {
    return {
        id: customerId,
    }
}

export const deleteCustomerById = (customerId) => {
    return {
        id: customerId,
    }
}

