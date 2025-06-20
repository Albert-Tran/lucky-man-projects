import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints.js';
import {buildUrl} from '../../utils/helpers/urlBuilder.js';

const financeApi = {

    transferNativeCoinToMultiple: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.FINANCE.TRANSFER_NATIVE_COIN_TO_MULTIPLE, data);
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

    transferNativeCoinFromMultiple: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.FINANCE.TRANSFER_NATIVE_COIN_FROM_MULTIPLE, data);
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

    transferCustomCoinToMultiple: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.FINANCE.TRANFER_CUSTOM_COIN_TO_MULTIPLE, data);
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

    approveTokenSpending : async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.FINANCE.APPROVE_TOKEN_SPENDING, data);
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

    swapNativeToTokens: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.FINANCE.SWAP_MULTI_NATIVE_TO_TOKENS, data);
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

    swapTokensToNative: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.FINANCE.SWAP_MULTI_TOKENS_TO_NATIVE, data);
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
    
};

export default financeApi;
