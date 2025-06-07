import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints.js';
import {buildUrl} from '../../utils/helpers/urlBuilder.js';

const financeApi = {

    transferNativeCoinToMultiple: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.TOKEN.TRANSFER_NATIVE_COIN_TO_MULTIPLE, data);
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Tao token khong thanh cong.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Tao token khong thanh cong.';
            throw new Error(errorMessage);
        }
    }
};

export default financeApi;
