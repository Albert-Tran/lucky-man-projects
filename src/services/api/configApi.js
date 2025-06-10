import httpClient from '../http/httpClient';
import { API_ENDPOINTS } from '../../utils/constants/apiEndpoints';
import {buildUrl} from '../../utils/helpers/urlBuilder.js';

const configApi = {
  getConfigByKey: async (key) => {
    try {
      const response = await httpClient.get(buildUrl(API_ENDPOINTS.CONFIG.GET_CONFIG_BY_KEY, {key: key}));
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
};

export default configApi;
