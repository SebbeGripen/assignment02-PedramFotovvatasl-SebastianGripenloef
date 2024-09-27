import { test, expect } from '@playwright/test';
import { APIHelper } from './apiHelpers';
import { generateRandomCustomerPayload } from './testData';
import { generateRandomCarPayload } from './testData';

test.describe('Test suite 1 backend', () => {
  let apiHelper: APIHelper;

  test.beforeAll(() => {
    apiHelper = new APIHelper(`${process.env.BASE_URL}`); //if this doenst work replace with only BASE_URL
  })

  test('Test case 01 - Get all customers', async ({ request }) => {
    const getCustomers = await apiHelper.getAllCustomers(request);
    expect(getCustomers.ok()).toBeTruthy();
    expect(getCustomers.status()).toBe(200);
  });

  test('Test case 02 - create random customer', async ({ request }) => {
    const payload = generateRandomCustomerPayload();
    const createCustomer = await apiHelper.createCustomer(request, payload);
    expect(createCustomer.ok()).toBeTruthy();
    expect(createCustomer.status()).toBe(201);

    // verifying from the POST requestr
    expect(await createCustomer.json()).toMatchObject({
      username: payload.username,
      name: payload.name,
      adress: payload.adress,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    })

    // verifying from GET request 
    const getCustomers = await apiHelper.getAllCustomers(request);
    expect(getCustomers.ok()).toBeTruthy();
    expect(await getCustomers.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: payload.username,
          name: payload.name,
          adress: payload.adress,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
        })
      ])
    )
  });

  test('Test case 06 - Get all cars', async ({ request }) => {
    const getCars = await apiHelper.getAllCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(getCars.status()).toBe(200);
  });

  test('Test case 07 - create a random car', async ({ request }) => {
    const payload = generateRandomCarPayload();
    const createCar = await apiHelper.createCar(request, payload);
    expect(createCar.ok()).toBeTruthy();
    expect(createCar.status()).toBe(201);

    // verifying from the POST request
    expect(await createCar.json()).toMatchObject({
      pricePerDay: payload.pricePerDay,
      fabric: payload.fabric,
      model: payload.model,
      registrationNumber: payload.registrationNumber,
    })

    // verifying from GET request 
    const getCars = await apiHelper.getAllCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(getCars.status()).toBe(200);
    expect(await getCars.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pricePerDay: payload.pricePerDay,
          fabric: payload.fabric,
          model: payload.model,
          registrationNumber: payload.registrationNumber,
        })
      ])
    )
  });

  test('Test case 08 - update car', async ({ request }) => {
    const getCars = await apiHelper.getAllCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(getCars.status()).toBe(200);
    const allCars = await getCars.json();
    const firstID = allCars[0].id;
    const payload = generateRandomCarPayload();
    const updatePayload = {
      id: firstID,
      ...payload
    };
    const updateCar = await apiHelper.updateCar(request, updatePayload);
    expect(updateCar.ok()).toBeTruthy();
    expect(updateCar.status()).toBe(200);

    // verifying from the PUT request
    expect(await updateCar.json()).toMatchObject({
      id: firstID,
      pricePerDay: payload.pricePerDay,
      fabric: payload.fabric,
      model: payload.model,
      registrationNumber: payload.registrationNumber,
      isBooked: payload.isBooked,
    })

    // verifying from GET request 
    const getCars2 = await apiHelper.getAllCars(request);
    expect(getCars2.ok()).toBeTruthy();
    expect(getCars2.status()).toBe(200);
    expect(await getCars2.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstID,
          pricePerDay: payload.pricePerDay,
          fabric: payload.fabric,
          model: payload.model,
          registrationNumber: payload.registrationNumber,
          isBooked: payload.isBooked,
        })
      ])
    )
  });

  test('Test case 09 - Delete car', async ({ request }) => {
    const getCars = await apiHelper.getAllCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(getCars.status()).toBe(200);
    const allCars = await getCars.json();
    const lastButOneID = allCars[allCars.length - 2].id;
    const payload = { id: lastButOneID };

    //Delete request
    const deleteRequest = await apiHelper.deleteCar(request, payload);
    expect(deleteRequest.ok()).toBeTruthy();
    expect(deleteRequest.status()).toBe(200);
    const deleteRequestAgain = await apiHelper.deleteCar(request, payload);
    expect(deleteRequestAgain.status()).toBe(404)

    const getCars2 = await apiHelper.getAllCars(request);
    expect(getCars2.ok()).toBeTruthy();
    expect(getCars2.status()).toBe(200);
    const allCarsAfterDelete = await getCars2.json();
    expect(allCarsAfterDelete).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: lastButOneID,
        })
      ])
    );
  });
})