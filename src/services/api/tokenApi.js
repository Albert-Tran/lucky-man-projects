import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints';
import {buildUrl} from '../../utils/helpers/urlBuilder.js';

const tokenApi = {

    createToken: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.TOKEN.CREATE, data);
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Tao token khong thanh cong.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Tao token khong thanh cong.';
            throw new Error(errorMessage);
        }
    },

    delete: async (tokenId) => {
        try {
            const response = await httpClient.delete(buildUrl(API_ENDPOINTS.TOKEN.DELETE_BY_ID, {id: tokenId}));
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Xoa token khong thanh cong.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Xoa token khong thanh cong.';
            throw new Error(errorMessage);
        }
    },

    searchTokens: async (filters) => {
        try {
            const response = await httpClient.get(API_ENDPOINTS.TOKEN.SEARCH, {
                params: filters
            } );
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                return {
                    total:0,
                    tokens: []
                }
                throw new Error(response?.data?.message || 'Lay thong tin danh sach token khong thanh cong.');
            }
        } catch (error) {
            return {
                total:0,
                tokens: []
            }
            const errorMessage = error.response?.data?.message || error.message || 'Lay thong tin danh sach token khong thanh cong.';
            throw new Error(errorMessage);
        }
    },

    getTokens: async (filters) => {
        try {
            const response = await httpClient.get(API_ENDPOINTS.TOKEN.LIST, {
                params: filters
            });
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response.data.message || 'Lay thong tin danh sach token khong thanh cong.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Lay thong tin danh sach token khong thanh cong.';
            throw new Error(errorMessage);
        }
    },

    getTokensByChainId: async (chainId) => {
        try {
            const response = await httpClient.get(buildUrl(API_ENDPOINTS.TOKEN.LIST_BY_CHAIN_ID, {id: chainId}));
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response.data.message || 'Lay thong tin danh sach token theo chain id khong thanh cong.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Lay thong tin danh sach token theo chain id khong thanh cong.';
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
