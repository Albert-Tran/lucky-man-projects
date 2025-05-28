import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints';

const walletApi = {
    getWalletGroups: async (filter) => {
        return [
            {
                id: 1,
                name: 'Group 1',
                walletCount: 3,
                description: 'Nhom cua Lucky Man'
            },
            {
                id: 2,
                name: 'Group 2',
                walletCount: 2,
                description: 'Nhom cua Hoang'
            },
            {
                id: 3,
                name: 'Group 3',
                walletCount: 2,
                description: 'Nhom cua Albert'
            }
        ];
        try {
            const response = await httpClient.get(API_ENDPOINTS.WALLET.WALLET_GROUP_MANAGER);
            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Lấy thông tin người dùng không thành công.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.';
            throw new Error(errorMessage);
        }
    },
    
    deleteWalletGroups: async ([groupId]) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.WALLET.WALLET_GROUP_MANAGER);
            if (response.data.success) {
                return response.data;
            } else {
                throw new Error(response.data.message || 'Lấy thông tin người dùng không thành công.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.';
            throw new Error(errorMessage);
        }
    }
};

export default walletApi;