import { faker } from "@faker-js/faker";

export const generateRandomCustomerPayload = () => {
    return {
        username: faker.internet.userName(),
        name: faker.person.fullName(),
        address: faker.location.streetAddress(),
        email: faker.internet.exampleEmail(),
        phoneNumber: faker.phone.number({ style: 'international' }),
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

export const generateBooking = () => {
    return {
        date: faker.date.between({ from: '2024-10-10T00:00:00.000Z', to: '2026-01-01T00:00:00.000Z' }),
        numberOfDays: faker.number.int({ min: 3, max: 30 }),

    }
}