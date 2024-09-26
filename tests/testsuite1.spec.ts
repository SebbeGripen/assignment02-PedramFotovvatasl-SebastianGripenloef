import { test, expect } from '@playwright/test';
import { APIHelper } from './apiHelpers';
import { generateRandomCustomerPayload, deleteCarPayload, generateChangedCarPayload } from './testData';
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
      adress:payload.adress,
      email:payload.email,
      phoneNumber:payload.phoneNumber,
    })

    // verifying from GET request 
    const getCustomers = await apiHelper.getAllCustomers(request);
    expect(getCustomers.ok()).toBeTruthy();
    expect(await getCustomers.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: payload.username,
          name: payload.name,
          adress:payload.adress,
          email:payload.email,
          phoneNumber:payload.phoneNumber,
        })
      ])
    )
  });

  test('Test case 05 - Get all cars', async ({ request }) => {
    const getCars = await apiHelper.getAllCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(getCars.status()).toBe(200);
  });

  test('Test case 06 - create a random car', async ({ request }) => {
    const payload = generateRandomCarPayload();
    const createCar = await apiHelper.createCar(request, payload);
    expect(createCar.ok()).toBeTruthy();
    expect(createCar.status()).toBe(201);

    // verifying from the POST request
    expect(await createCar.json()).toMatchObject({
      pricePerDay: payload.pricePerDay,
      fabric: payload.fabric,
      model:payload.model,
      registrationNumber:payload.registrationNumber,
    })

    // verifying from GET request 
    const getCars = await apiHelper.getAllCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(await getCars.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pricePerDay: payload.pricePerDay,
          fabric: payload.fabric,
          model:payload.model,
          registrationNumber:payload.registrationNumber,
        })
      ])
    )
  });

  test('Test case 07 - change car', async ({ request }) => {
    const payload = generateChangedCarPayload(2);
    const changeCar = await apiHelper.updateCar(request, payload);
    expect(changeCar.ok()).toBeTruthy();
    expect(changeCar.status()).toBe(200);

    // verifying from the PUT request
    expect(await changeCar.json()).toMatchObject({
      id: payload.id,
      pricePerDay: payload.pricePerDay,
      fabric: payload.fabric,
      model:payload.model,
      registrationNumber:payload.registrationNumber,
    })

    // verifying from GET request 
    const getCars = await apiHelper.getAllCars(request);
    expect(getCars.ok()).toBeTruthy();
    expect(await getCars.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: payload.id,
          pricePerDay: payload.pricePerDay,
          fabric: payload.fabric,
          model:payload.model,
          registrationNumber:payload.registrationNumber,
        })
      ])
    )
  });

  test('Test case 08 - Delete Cars', async ({ request }) => {
    const payload = deleteCarPayload(2);
    const deleteCar = await apiHelper.deleteCar(request,payload);
    expect(deleteCar.ok()).toBeFalsy();
    expect(deleteCar.status()).toBe(204)

    // GET by ID and verify status as 404
   
  });

  /*test('Test case 03 - Delete Post - v2', async ({ request }) => {
    const getPosts = await apiHelper.getAllPosts(request);
    expect(getPosts.ok()).toBeTruthy();
    const allPosts = await getPosts.json();
    const lastButOneID = allPosts[allPosts.length - 2].id;

    //Delete request
    const deleteRequest = await apiHelper.deletePost(request, lastButOneID);
    expect(deleteRequest.ok()).toBeTruthy();

    // GET by ID and verify status as 404
    const getPostById = await apiHelper.getByID(request, lastButOneID);
    expect(getPostById.status()).toBe(404);
  });*/
})