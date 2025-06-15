import CONFIG from "../config/config.js";

const SUPPORTED_CHAINS = CONFIG[import.meta.env.VITE_MODE].SUPPORTED_CHAINS; 

export const getChainNameById = (chainId) => {
    const chain = SUPPORTED_CHAINS.find(chain => chain.value == chainId);
    return chain ? chain.label : 'Chain không tồn tại ';
};

export const getMultiCallContractAddressKeyByChainId = (chainId) => {
    return `multicall_contract_address_${chainId}`;
}

export const getNativeTokenAddressByChainId = (chainId) => {
    const chain = SUPPORTED_CHAINS.find(chain => chain.value == chainId);
    return chain.native_token_address;
}
