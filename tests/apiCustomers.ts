import { APIRequestContext } from "@playwright/test";

export class APICustomers{
    private baseUrl: string;

    constructor(baseUrl: string){
        this.baseUrl = baseUrl;
    }

    //POST, GET, PUT, DELETE
    async getAllCustomers(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/api/v1/customers`);
        return response;
    }

    async getCustomerByID(request: APIRequestContext, customerId: number) {
        const response = await request.get(`${this.baseUrl}/api/v1/customers${customerId}`);
        return response;
    }

    async updateCustomer(request: APIRequestContext, customerId: number, payload: object) {
        const response = await request.put(`${this.baseUrl}/api/v1/customers${customerId}`, {
            data: JSON.stringify(payload),
        });
        return response;
    }

    async createCustomer(request: APIRequestContext, payload: object){
        const response = await request.post(`${this.baseUrl}/api/v1/addcustomer`, {
            data: JSON.stringify(payload),
        })
        return response;
    }

    async deleteCustomer(request: APIRequestContext, postId: number){
        const response = await request.delete(`${this.baseUrl}/api/v1/deletecustomer/${postId}`);
        return response;
    }
}