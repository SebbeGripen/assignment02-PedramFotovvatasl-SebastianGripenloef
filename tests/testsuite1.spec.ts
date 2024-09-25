import { test, expect } from '@playwright/test';
import { APIHelper } from './apiHelpers';
import { generateRandomCustomerPayload, generateupdatedCustomer } from './testData';
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
      address:payload.address,
      email:payload.email,
      phoneNumber:payload.phoneNumber,
    })

    // verifies the new user is now in the customer list when a GET request is made 
    const getCustomers = await apiHelper.getAllCustomers(request);
    expect(getCustomers.ok()).toBeTruthy();
    expect(await getCustomers.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          username: payload.username,
          name: payload.name,
          address:payload.address,
          email:payload.email,
          phoneNumber:payload.phoneNumber,
        })
      ])
    )
  });

  test('Test case 03 - Update an existing customer and assert that the PUT request was successful and that the fields were updated.', async ({ request }) => {
    //const customerID = 1;
    const payload = generateupdatedCustomer();
    const updateCustomers = await apiHelper.updateCustomer(request,payload);
    expect(updateCustomers.status()).toBe(200);

    const responseBody = await updateCustomers.json();
    expect(responseBody.username).toBe(payload.username);
    expect(responseBody.name).toBe(payload.name);
    expect(responseBody.address).toBe(payload.address);
    expect(responseBody.email).toBe(payload.email);
    expect(responseBody.phoneNumber).toBe(payload.phoneNumber);

    expect(payload.username).toBeLessThanOrEqual(50);
  });

  test('Test case 4 - Delete a customer by its ID and assert that the entry is actually gone.', async ({ request }) => {
    const deleteCustomers = await apiHelper.deleteCustomer(request);
    //expect(deleteCustomers.ok()).toBeFalsy();
    expect(deleteCustomers.status()).toBe(404);
  });

  /*test('Test case 04 - Delete Post - v2', async ({ request }) => {
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
  });  */
})