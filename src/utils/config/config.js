const CONFIG = {
    PRODUCTION: {
        API_BASE_URL: "http://3.76.45.112:5000/api",
        WAGMI_WALLETCONNECT_PROJECT_ID: "c6ecf3c63747ee4ade44fc5a4fb62151",
        ITEMS_PER_PAGE_OPTIONS: [6, 9, 12],
        SUPPORTED_CHAINS: [
            { value: 1, label: 'Ethereum', native_token_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
            { value: 8453, label: 'Base', native_token_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' }
        ],
        RPC_URLS: {
            1: 'https://1.rpc.thirdweb.com',
            8453: 'https://mainnet.base.org'
        },
        BLOCKCHAIN_EXPLORER_URLS: {
            1: 'https://etherscan.io/',
            8453: 'https://basescan.org/'
        },
        ITEMS_PER_PAGE_IN_SELECT_FIELD: 2
    },
    DEVELOPER: {
        API_BASE_URL: "http://3.76.45.112:5000/api",
        WAGMI_WALLETCONNECT_PROJECT_ID: "c6ecf3c63747ee4ade44fc5a4fb62151",
        ITEMS_PER_PAGE_OPTIONS: [6, 9, 12],
        SUPPORTED_CHAINS: [
            { value: 1, label: 'Ethereum', native_token_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
            { value: 8453, label: 'Base', native_token_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' }
        ],
        RPC_URLS: {
            1: 'https://1.rpc.thirdweb.com',
            8453: 'https://mainnet.base.org'
        },
        BLOCKCHAIN_EXPLORER_URLS: {
            1: 'https://etherscan.io/',
            8453: 'https://basescan.org/'
        },
        ITEMS_PER_PAGE_IN_SELECT_FIELD: 2
    }
};

export default CONFIG
