import { ethers } from 'ethers';
import ERC20_ABI from './abi/ERC20_ABI.js';
import CONFIG from '../../../utils/config/config.js';

// Cấu hình RPC URLs cho các mạng bạn muốn hỗ trợ
// LƯU Ý: Đây là các public RPC. Đối với ứng dụng production,
// bạn nên dùng Infura/Alchemy/QuickNode với API key của riêng bạn,
// hoặc sử dụng provider từ ví người dùng (Metamask, WalletConnect).
const RPC_URLS = CONFIG[import.meta.env.VITE_MODE].RPC_URLS; 

/**
 * Lấy thông tin token (name, symbol, decimals) trực tiếp từ blockchain.
 * @param {string} address - Địa chỉ contract của token (ví dụ: '0x...').
 * @param {string} chainName - Tên chuỗi blockchain (ví dụ: 'ethereum', 'base').
 * @returns {Promise<{name: string, symbol: string, decimals: number}>} Thông tin token.
 * @throws {Error} Nếu có lỗi khi fetch hoặc địa chỉ/chain không hợp lệ.
 */
export const fetchTokenOnChainInfo = async (address, chainName) => {
  const rpcUrl = RPC_URLS[chainName];

  if (!rpcUrl) {
    throw new Error(`Chain "${chainName}" không được hỗ trợ hoặc cấu hình RPC.`);
  }
  if (!ethers.isAddress(address)) { // Sử dụng ethers.isAddress để kiểm tra địa chỉ hợp lệ
    throw new Error(`Địa chỉ contract "${address}" không hợp lệ.`);
  }

  try {
    // Tạo một JsonRpcProvider để kết nối với blockchain
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Tạo một Contract instance
    // provider.getNetwork() sẽ trả về Network object, từ đó lấy chainId
    // Đây là cách an toàn hơn để đảm bảo provider hoạt động với chainName
    const network = await provider.getNetwork();
    if (network.name !== chainName) {
        // Có thể thêm kiểm tra chainId nếu chainName không khớp chính xác với network.name
        // Ví dụ: network.chainId !== desiredChainId
        console.warn(`Provider cho ${chainName} đang kết nối tới mạng ${network.name}.`);
    }

    const contract = new ethers.Contract(address, ERC20_ABI, provider);

    // Gọi các hàm view (read-only) của contract
    // Sử dụng Promise.all để gọi đồng thời, tăng hiệu suất
    const [name, symbol, decimals] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
    ]);

    return { name, symbol, decimals: Number(decimals) }; // Chuyển decimals về số nguyên
  } catch (error) {
    console.error(`Lỗi khi lấy thông tin on-chain cho ${address} trên ${chainName}:`, error);
    // Cung cấp thông báo lỗi rõ ràng hơn cho người dùng
    let userMessage = 'Không thể lấy thông tin token on-chain. Vui lòng kiểm tra địa chỉ contract và chain.';
    if (error.reason && error.reason.includes('code=CALL_EXCEPTION')) {
      userMessage = 'Địa chỉ contract không phải là token hoặc không tồn tại trên chain này.';
    } else if (error.code === 'NETWORK_ERROR') {
      userMessage = 'Lỗi kết nối mạng hoặc RPC. Vui lòng thử lại sau.';
    } else if (error.message.includes('insufficient funds for gas')) {
        // Lỗi này thường không xảy ra với view function, nhưng là ví dụ
        userMessage = 'Lỗi phí gas (không liên quan đến hàm view).';
    }
    throw new Error(userMessage);
  }
};
