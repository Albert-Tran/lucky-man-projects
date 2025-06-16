import { ethers } from 'ethers';

export const formatPriceWithDecimals = (value, decimals) => {
    return ethers.parseUnits(value, decimals).toString();
}
