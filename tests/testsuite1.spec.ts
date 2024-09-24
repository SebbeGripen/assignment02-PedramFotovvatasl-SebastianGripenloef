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
    //expect(createCustomer.ok()).toBeTruthy();
    //expect(createCustomer.status()).toBe(200);

    // verifying from the POST requestr
    expect(await createCustomer.json()).toMatchObject({
      username: payload.username,
      name: payload.name,
      adress:payload.address,
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
          adress:payload.address,
          email:payload.email,
          phoneNumber:payload.phoneNumber,
        })
      ])
    )
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
  });  */
})