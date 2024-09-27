import { test, expect } from '@playwright/test';
import { APIHelper } from './apiHelpers';
import { generateRandomCustomerPayload } from './testData';
import { generateRandomCarPayload } from './testData';

test.describe('Test suite 1 backend', () => {
  let apiHelper: APIHelper;

  test.beforeAll(() => {
    apiHelper = new APIHelper(`${process.env.BASE_URL}`); //if this doenst work replace with only BASE_URL
  })

  test('Test case 01 - Get all customers and assert that the response is 200', async ({ request }) => {
    const getCustomers = await apiHelper.getAllCustomers(request);
    expect(getCustomers.ok()).toBeTruthy();
    expect(getCustomers.status()).toBe(200);
  });

  test('Test case 02 - Create a customer using faker data, and verify that the fields match the payload, and then assert that the new user is now in the list of all users. ', async ({ request }) => {
    const payload = generateRandomCustomerPayload();
    const createCustomers = await apiHelper.createCustomer(request, payload);
    expect(createCustomers.ok()).toBeTruthy();
    expect(createCustomers.status()).toBe(201);

    // verifying that fields match the payload
    expect(await createCustomers.json()).toMatchObject({
      username: payload.username,
      name: payload.name,
      address: payload.address,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    })

    // verifies the new user is now in the customer list when a GET request is made 
    const getCustomers = await apiHelper.getAllCustomers(request);
    expect(getCustomers.ok()).toBeTruthy();
    expect(await getCustomers.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: payload.username,
          name: payload.name,
          address: payload.address,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
        })
      ])
    )
  });

  test('Test case 03 - Retrieve a list of all customers, update the first customer on the list, assert that the fields have been updated, and then make another GET request to see the updated list.', async ({ request }) => {
    const getCustomers = await apiHelper.getAllCustomers(request);
    expect(getCustomers.ok()).toBeTruthy();
    const allCustomers = await getCustomers.json();
    expect(allCustomers.length).toBeGreaterThan(0); // Assert that there are customers to update
    const firstID = allCustomers[0].id;
    const payload = generateRandomCustomerPayload();
    const updatedPayload = {
      id: firstID,
      ...payload
    };

    const updateCustomer = await apiHelper.updateCustomer(request, updatedPayload);
    expect(updateCustomer.ok()).toBeTruthy();
    expect(updateCustomer.status()).toBe(200);

    expect(await updateCustomer.json()).toMatchObject({
      id: firstID,
      username: payload.username,
      name: payload.name,
      address: payload.address,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
    })

    const getCustomers2 = await apiHelper.getAllCustomers(request);
    expect(getCustomers2.ok()).toBeTruthy();
    expect(await getCustomers2.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: firstID,
          username: payload.username,
          name: payload.name,
          address: payload.address,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
        })
      ])
    )

  });

  test('Test case 04 - Get all customers, and then delete the second to last ID and assert that the entry is gone. ', async ({ request }) => {
    const getCustomers = await apiHelper.getAllCustomers(request,);
    expect(getCustomers.ok()).toBeTruthy();
    const allCustomers = await getCustomers.json();
    expect(allCustomers.length).toBeGreaterThan(2); // Assert that the customer list has at least two entries so that the deletion can be made.
    const secondToLastID = allCustomers[allCustomers.length - 2].id;
    const payload = { id: secondToLastID };

    //Delete request
    const deleteRequest = await apiHelper.deleteCustomer(request, payload);
    expect(deleteRequest.ok()).toBeTruthy();
    const deleteRequest2 = await apiHelper.deleteCustomer(request, payload);
    expect(deleteRequest2.status()).toBe(404);
  });

  test('Test case 05 - Get all orders and assert that the list is not empty', async ({ request }) => {
    const getOrders = await apiHelper.getOrders(request);
    expect(getOrders.ok()).toBeTruthy();
    expect(getOrders.status()).toBe(200);

  });

  test('Test case 06 - Get all orders and assert that the list is not empty', async ({ request }) => {
    const allCars = await apiHelper.getAllCars(request);
    expect(allCars.ok()).toBeTruthy();
    expect(allCars.status()).toBe(200);

  });

  test('Test case 07 - Get all cars for admin', async ({ request }) => {
    const getCars = await apiHelper.getAllCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(getCars.status()).toBe(200);
  });

  test('Test case 08 - Get cars for customer', async ({ request }) => {
    const getCars = await apiHelper.getCustomerCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(getCars.status()).toBe(200);
  });

  test('Test case 09 - create a random car', async ({ request }) => {
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

  test('Test case 10 - update car', async ({ request }) => {
    const getCars = await apiHelper.getAllCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(getCars.status()).toBe(200);
    const allCars = await getCars.json();
    expect(allCars.length).toBeGreaterThan(0);
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

  test('Test case 11 - Delete car', async ({ request }) => {
    const getCars = await apiHelper.getAllCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(getCars.status()).toBe(200);
    const allCars = await getCars.json();
    expect(allCars.length).toBeGreaterThan(0);
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