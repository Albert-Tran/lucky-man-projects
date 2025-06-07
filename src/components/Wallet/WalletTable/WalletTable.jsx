import React from 'react';
import styles from './WalletTable.module.css';

const WalletTable = ({ totalBalance, walletData, loading, error }) => {
  if (loading) {
    return <div className={styles.loadingMessage}>Đang tải dữ liệu ...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>Lỗi: {error}</div>;
  }

  if (!walletData || walletData.length === 0) {
    return <div className={styles.noDataMessage}>Không có ví nào.</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <h3 className={styles.tableTitle}>Tổng số dư: {totalBalance}</h3>
      <table className={styles.balanceTable}>
        <thead>
          <tr>
            <th>Địa chỉ ví</th>
            <th>Số dư</th>
          </tr>
        </thead>
        <tbody>
          {walletData.map((item, index) => (
            <tr key={item.address || index}>
              <td>{item.address}</td>
              <td>{item.balance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletTable;