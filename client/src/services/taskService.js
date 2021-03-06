import { post, get, update, deleteRequest } from "../helpers/apiHelper";
import { keys } from "../helpers/keys";

const { apiUrl } = keys;

const taskService = {
    create: async (task, token) => {
        try {
            const url = `${apiUrl}/api/tasks`;
            const resp = await post(url, task, token);
            return resp.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    get: async (id, token) => {
        try {
            const url = `${apiUrl}/api/tasks/${id}`;
            const resp = await get(url, token);
            return resp.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    getAll: async (filters, token) => {
        try {
            const url = `${apiUrl}/api/tasks`;
            if (filters) {
                url += "?";
                Object.keys(filters).forEach((key, index) => {
                    if (index !== 0) url += '&';
                    url += `${key}=${obj[key]}`;
                })
            }
            const resp = await get(url, token);
            return resp.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    update: async (id, data, token) => {
        try {
            const url = `${apiUrl}/api/tasks/${id}`;
            const resp = await update(url, data, token);
            return resp.data;
        } catch (e) {
            return Promise.reject(e);
        }
    },
    delete: async (id, token) => {
        try {
            const url = `${apiUrl}/api/tasks/${id}`;
            const resp = await deleteRequest(url, token);
            return resp.data;
        } catch (e) {
            return Promise.reject(e);
        }
    }
}

export default taskService;