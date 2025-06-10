export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://3.76.45.112:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login/email',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh-token',
    ME: '/auth/me'
  },
  CONFIG: {
    GET_CONFIG_BY_KEY: '/configs/key/:key'
  },
  USERS: {
    LIST: '/users',
    DETAIL: '/users/:id',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  TOKEN: {
    CREATE: '/tokens',
    DELETE_BY_ID: '/tokens/:id',
    LIST: '/tokens',
    LIST_BY_CHAIN_ID: '/tokens/chain/:id',
    SEARCH: 'tokens/search',
    GET_BY_NAME: '/tokens/name/:name',
    GET_BY_ADDRESS: '/tokens/address/:address',
    GET_BY_CHAIN: '/tokens/chain/:chainId',
    DETAIL: '/tokens/:address'
  },
  WALLET: {
    GET_WALLETS_BY_GROUP_ID: '/wallets/group/:groupId',
    GET_WALLETS_WITH_TOKEN_BALANCE: '/wallets/token-balances',
    WALLET_MANAGER: '/wallets/alls',
    CREATE_NEW_WALLET: '/wallets',
    DELETE_WALLET_BY_ID: '/wallets/:id',
    EXPORT_WALLETS: 'wallets/export',
    IMPORT_WALLET: 'wallets/import',
    WALLET_GROUP_MANAGER: '/groups',
    CREATE_NEW_WALLET_GROUP: '/groups',
    GET_WALLET_GROUP_BY_ID: '/groups/:id',
    UPDATE_WALLET_GROUP: '/groups/:id',
    DELETE_WALLET_GROUP_BY_ID: '/groups/:id'
  },
  FINANCE: {
    TRANSFER_NATIVE_COIN_TO_MULTIPLE: '/blockchain/transfer/native-coin/to-multiple',
    TRANSFER_NATIVE_COIN_FROM_MULTIPLE:'/blockchain/transfer/native-coin/from-multiple',
    TRANFER_CUSTOM_COIN_TO_MULTIPLE: '/blockchain/transfer/token/to-multiple',
    APPROVE_TOKEN_SPENDING: '/blockchain/approve-token-spending'
  }
};
