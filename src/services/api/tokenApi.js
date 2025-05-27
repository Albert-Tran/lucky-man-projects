import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints';

const tokenApi = {

    create: async (tokenData) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.TOKEN.CREATE, {tokenData});
            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Tao token khong thanh cong.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Tao token khong thanh cong.';
            throw new Error(errorMessage);
        }
    },

    delete: async (address) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.TOKEN.DELETE, {address});
            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Xoa token khong thanh cong.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Xoa token khong thanh cong.';
            throw new Error(errorMessage);
        }
    },


    getTokens: async (filters) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.TOKEN.LIST, {filters});
            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Lay thong tin danh sach token khong thanh cong.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Lay thong tin danh sach token khong thanh cong.';
            throw new Error(errorMessage);
        }
    },

    getToken: async (address) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.TOKEN.DETAIL, {address});
            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Lay thong tin token khong thanh cong.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Lay thong tin token khong thanh cong.';
            throw new Error(errorMessage);
        }
    },
};

export default tokenApi;
