import { APIRequestContext } from "@playwright/test";

export class APICars{
    private baseUrl: string;

    constructor(baseUrl: string){
        this.baseUrl = baseUrl;
    }

    //POST, GET, PUT, DELETE

    async getAllCars(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/api/v1/allcars`);
        return response;
    }

    async createCar(request: APIRequestContext, payload: object){
        const response = await request.post(`${this.baseUrl}/api/v1/addcar`, {
            data: JSON.stringify(payload),
        })
        return response;
    }

    async updateCar(request: APIRequestContext, carId: number, payload: object) {
        const response = await request.put(`${this.baseUrl}/api/v1/customers${carId}`, {
            data: JSON.stringify(payload),
        });
        return response;
    }

    async deleteCar(request: APIRequestContext, postId: number){
        const response = await request.delete(`${this.baseUrl}/api/v1/deletecar/${postId}`);
        return response;
    }
}