const CONFIG = {
    PRODUCTION: {
        API_BASE_URL: "http://3.76.45.112:5000/api",
        WAGMI_WALLETCONNECT_PROJECT_ID: "c6ecf3c63747ee4ade44fc5a4fb62151",
        ITEMS_PER_PAGE_OPTIONS: [6, 9, 12],
        SUPPORTED_CHAINS: [
            { value: 1, label: 'Ethereum' },
            { value: 8453, label: 'Base' }
        ],
        RPC_URLS: {
            1: 'https://1.rpc.thirdweb.com',
            8453: 'https://mainnet.base.org'
        }
    },
    DEVELOPER: {
        API_BASE_URL: "http://3.76.45.112:5000/api",
        WAGMI_WALLETCONNECT_PROJECT_ID: "c6ecf3c63747ee4ade44fc5a4fb62151",
        ITEMS_PER_PAGE_OPTIONS: [6, 9, 12],
        SUPPORTED_CHAINS: [
            { value: 1, label: 'Ethereum' },
            { value: 8453, label: 'Base' }
        ],
        RPC_URLS: {
            1: 'https://1.rpc.thirdweb.com',
            8453: 'https://mainnet.base.org'
        }
    }
};

export default CONFIG
