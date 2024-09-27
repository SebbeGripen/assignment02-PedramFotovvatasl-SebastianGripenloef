import { faker } from "@faker-js/faker";

export const generateRandomCustomerPayload = () => {
    return {
        username: faker.internet.userName(),
        name: faker.person.fullName(),
        adress: faker.location.streetAddress(),
        email: faker.internet.exampleEmail(),
        phoneNumber: faker.phone.number(),
    }
}

export const generateRandomCarPayload = () => {
    return {
        pricePerDay: faker.number.float({ min: 100, max: 1000, fractionDigits: 1, }),
        fabric: faker.vehicle.color(),
        model: faker.vehicle.vehicle(),
        registrationNumber: faker.vehicle.vrm(),
        isBooked: false,
    }
}

export const orderCar = () => {
    return {
        date: faker.date.future({ years: 1 }),
        numberOfDays: faker.number.int({ min: 1, max: 30 }),
    }
}