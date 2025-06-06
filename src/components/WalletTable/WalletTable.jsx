// src/components/BalanceDisplayTable.jsx
import React from 'react';
import styles from './WalletTable.module.css';

const WalletTable = ({ data, loading, error }) => {
  if (loading) {
    return <div className={styles.loadingMessage}>Đang tải dữ liệu ...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>Lỗi: {error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className={styles.noDataMessage}>Không có ví nào.</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.tableTitle}>Danh sách ví</h3>
      <table className={styles.balanceTable}>
        <thead>
          <tr>
            <th>Địa chỉ ví</th>
            <th>Số dư</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.address || index}> {/* Sử dụng address làm key nếu có */}
              <td>{item.address}</td>
              <td>{item.tokenBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletTable;