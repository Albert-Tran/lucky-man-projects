import httpClient from '../http/httpClient.js';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints';
import {buildUrl} from '../../utils/helpers/urlBuilder.js';

const walletApi = {
    getWallestWithTokenBalance: async (filter) => {
        try {
            const response = await httpClient.get(API_ENDPOINTS.WALLET.GET_WALLETS_WITH_TOKEN_BALANCE, {
                params: filter // Truyền tham số phân trang qua query params
            } );
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Lấy danh sách ví không thành công.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.';
            throw new Error(errorMessage);
        }
    },

    getWallets: async (filter) => {
        try {
            const response = await httpClient.get(API_ENDPOINTS.WALLET.WALLET_MANAGER, {
                params: filter // Truyền tham số phân trang qua query params
            } );
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Lấy danh sach vi không thành công.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.';
            throw new Error(errorMessage);
        }
    },

    createWallet: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.WALLET.CREATE_NEW_WALLET, data);
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Tạo ví không thành công');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo ví.';
            throw new Error(errorMessage);
        }
    },

    deleteWalletById: async (id) => {
        try {
            
            const response = await httpClient.delete(buildUrl(API_ENDPOINTS.WALLET.DELETE_WALLET_BY_ID, {id: id}));
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Xoa vi không thành công.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi xoa vi.';
            throw new Error(errorMessage);
        }
    },

    importWallet: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.WALLET.IMPORT_WALLET, data);
            if (response?.status === 201) {
                return response?.data;
            } else {
                throw new Error(response?.message || 'Tạo ví không thành công');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo ví.';
            throw new Error(errorMessage);
        }
    },

    exportWallets: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.WALLET.EXPORT_WALLETS, data);
            console.log('response', response.data);
            if (response?.status === 201) {
                return response?.data;
            } else {
                throw new Error(response?.message || 'Tạo ví không thành công');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi tạo ví.';
            throw new Error(errorMessage);
        }
    },

    getWalletGroups: async (filter) => {
        try {
            const response = await httpClient.get(API_ENDPOINTS.WALLET.WALLET_GROUP_MANAGER, {
                params: filter // Truyền tham số phân trang qua query params
            } );
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Lấy thông tin người dùng không thành công.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.';
            throw new Error(errorMessage);
        }
    },

    getWalletGroupById: async (id) => {
        try {
            const response = await httpClient.get(buildUrl(API_ENDPOINTS.WALLET.GET_WALLET_GROUP_BY_ID, {id: id}));
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Lấy thông tin người dùng không thành công.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.';
            throw new Error(errorMessage);
        }
    },
    
    createWalletGroup: async (data) => {
        try {
            const response = await httpClient.post(API_ENDPOINTS.WALLET.CREATE_NEW_WALLET_GROUP, data);
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Xoá nhóm ví không thành công');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi xoá nhóm ví.';
            throw new Error(errorMessage);
        }
    },

    updateWalletGroup: async (id, data) => {
        try {
            const response = await httpClient.patch(buildUrl(API_ENDPOINTS.WALLET.UPDATE_WALLET_GROUP, {id: id}), data);
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Sửa nhóm ví không thành công');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi sửa nhóm ví.';
            throw new Error(errorMessage);
        }
    },

    deleteWalletGroups: async (id) => {
        try {
            
            const response = await httpClient.delete(buildUrl(API_ENDPOINTS.WALLET.DELETE_WALLET_GROUP_BY_ID, {id: id}));
            if (response?.data?.success) {
                return response?.data?.data;
            } else {
                throw new Error(response?.data?.message || 'Lấy thông tin người dùng không thành công.');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi lấy thông tin người dùng.';
            throw new Error(errorMessage);
        }
    }
};

export default walletApi;