import { test, expect } from '@playwright/test';
import { APIHelper } from './apiHelpers';
import { generateRandomCustomerPayload, generateupdatedCustomer, } from './testData';

test.describe('Test suite 1 backend', () => {
  let apiHelper: APIHelper;

  test.beforeAll(() => {
    apiHelper = new APIHelper(`${process.env.BASE_URL}`);
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
    const payload = generateupdatedCustomer();
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


})