import { APIRequestContext } from "@playwright/test";

export class APIHelper {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    //POST, GET, PUT, DELETE CUSTOMER
    async getAllCustomers(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/api/v1/customers`);
        return response;
    }

    async getCustomerByID(request: APIRequestContext, payload:object) {
        const response = await request.get(`${this.baseUrl}/api/v1/customers`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
        })
        return response;
    }

    async updateCustomer(request: APIRequestContext, payload: object) {
        const response = await request.put(`${this.baseUrl}/api/v1/updatecustomer`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
        })
        return response;
    }

    async createCustomer(request: APIRequestContext, payload: object) {
        const response = await request.post(`${this.baseUrl}/api/v1/addcustomer`, {
            headers: {
                'Content-Type': 'application/json',
            },

            data: JSON.stringify(payload),
        })
        return response;
    }

    async deleteCustomer(request: APIRequestContext, payload: object) {
        const response = await request.delete(`${this.baseUrl}/api/v1/deletecustomer`, {
            headers: {
                'Content-Type': 'application/json',
            },

            data: JSON.stringify(payload),
        })
        return response;
    }
    // CRUD CARS
    async getAllCars(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/api/v1/allcars`);
        return response;
    }

    async createCar(request: APIRequestContext, payload: object) {
        const response = await request.post(`${this.baseUrl}/api/v1/addcar`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
        })
        return response;
    }


    async updateCar(request: APIRequestContext, payload: object) {
        const response = await request.put(`${this.baseUrl}/api/v1/updatecar`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
        })
        return response;
    }


    async deleteCar(request: APIRequestContext, payload: object) {
        const response = await request.delete(`${this.baseUrl}/api/v1/deletecar`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
        })
        return response;
    }


    //PUT,POST,GET, orders

    async getOrders(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/api/v1/orders`);
        
        return response;
    }

    async getCustomerCars(request: APIRequestContext) {
        const response = await request.get(`${this.baseUrl}/api/v1/cars`);
        return response;
    }

    async orderCar(request: APIRequestContext, payload: object) {
        const response = await request.post(`${this.baseUrl}/api/v1/ordercar`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
        })
        return response;
    }

    async myOrders(request: APIRequestContext, payload: object) {
        const response = await request.post(`${this.baseUrl}/api/v1/myorder`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
        })
        return response;
    }

    async cancelOrder(request: APIRequestContext, orderId: number, payload: object) {
        const response = await request.put(`${this.baseUrl}/api/v1/cancelorder/${orderId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(payload),
        });
        return response;

    }
}
