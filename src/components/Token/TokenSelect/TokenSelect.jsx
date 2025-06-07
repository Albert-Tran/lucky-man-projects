import React, { useState, useEffect, useRef, useCallback } from 'react';
import Select from 'react-select';
import { components } from 'react-select';
import tokenApi from '../../../services/api/tokenApi.js';

const PAGE_LIMIT = 10;

const TokenSelect = ({chainId}) => {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTokens, setTotalTokens] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchControllerRef = useRef(null);

    const fetchTokens = useCallback(async (page, resetOptions = false) => {
        if (fetchControllerRef.current) {
            fetchControllerRef.current.abort();
        }
        const controller = new AbortController();
        fetchControllerRef.current = controller;

        setIsLoading(true);
        try {
            const response = await tokenApi.getTokensByChainId(chainId, {page, limit: PAGE_LIMIT});
            if (controller.signal.aborted) { // Kiểm tra nếu yêu cầu đã bị hủy
                return;
            }

            // Map dữ liệu API sang format mà react-select cần (value, label)
            const newOptions = response.tokens.map(token => ({
                value: token.address,
                label: token.token_name
            }));

            if (page === 1 && !resetOptions) {
                setOptions(newOptions);
            } else if (resetOptions) {
                setOptions(newOptions);
            } else {
                setOptions(prevOptions => {
                    const uniqueNewOptions = newOptions.filter(
                        newOpt => !prevOptions.some(existingOpt => existingOpt.value === newOpt.value)
                    );
                    return [...prevOptions, ...uniqueNewOptions];
                });
            }

            setTotalTokens(response.total);
            // Kiểm tra xem còn dữ liệu để tải nữa không
            setHasMore((page * PAGE_LIMIT) < response.total);

        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Fetch token aborted');
            } else {
                console.error("Error fetching tokens:", error);
            }
        } finally {
            setIsLoading(false);
            fetchControllerRef.current = null; // Đảm bảo ref được reset
        }
    }, [PAGE_LIMIT]); // Dependency của useCallback chỉ là PAGE_LIMIT (hằng số)

    useEffect(() => {
        let ignore = false; // Biến cờ để xử lý Strict Mode và tránh race condition

        const initialLoad = async () => {
            if (!ignore) {
                await fetchTokens(1, '', true); // Gọi lần đầu, cờ `resetOptions` là true để ghi đè
            }
        };
        initialLoad();

        return () => {
            ignore = true;
            if (fetchControllerRef.current) {
                fetchControllerRef.current.abort(); // Hủy yêu cầu đang chờ nếu component unmount
            }
        };
    }, [fetchTokens]);

    // Xử lý khi cuộn xuống cuối danh sách options
    const handleLoadMoreOption = () => {
        if (!isLoading && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchTokens(nextPage);
        }
    };

    const MenuList = (props) => {
        const { children } = props;
        return (
            <components.MenuList {...props}>
                {children}
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '8px 0' }}>Đang tải thêm...</div>
                )}
                {hasMore && !isLoading && (
                    <div style={{ textAlign: 'center', padding: '8px 0', cursor: 'pointer' }} onClick={handleLoadMoreOption}>
                        Tải thêm ({options.length} / {totalTokens})
                    </div>
                )}
                {!hasMore && !isLoading && options.length > 0 && (
                    <div style={{ textAlign: 'center', padding: '8px 0', color: '#888' }}>Đã tải hết {totalTokens} token.</div>
                )}
                {options.length === 0 && !isLoading && (
                    <div style={{ textAlign: 'center', padding: '8px 0', color: '#888' }}>Không tìm thấy token nào.</div>
                )}
            </components.MenuList>
        );
    };

    // Xử lý khi người dùng nhập tìm kiếm
    const handleInputChange = (inputValue) => {
        setCurrentPage(1);
        setOptions([]);
        setHasMore(true);
        fetchTokens(1, inputValue, true);
    };

    return (
        <div style={{ width: '450px', margin: '50px auto' }}>
            <h2>Chọn Token của bạn</h2>
            <Select
                options={options}
                isLoading={isLoading}
                components={{ MenuList }}
                placeholder="Tìm kiếm hoặc chọn token..."
                isClearable={false}
                isSearchable={false}
                onInputChange={handleInputChange}
                filterOption={() => true} 
                noOptionsMessage={() => (isLoading ? 'Đang tải...' : 'Không có tùy chọn nào')}
            />
        </div>
    );
};

export default TokenSelect;