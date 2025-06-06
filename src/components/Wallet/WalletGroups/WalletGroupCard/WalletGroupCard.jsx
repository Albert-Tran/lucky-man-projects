import React from 'react';
import { Link } from 'react-router-dom';
import styles from './WalletGroupCard.module.css';
import {formatToVietnamTime} from '../../../../utils/helpers/dateTimeHelpers';

const WalletGroupCard = ({ group, isSelected, onSelect, onEdit, onDelete }) => {
  const handleCheckboxChange = () => {
    onSelect(group.id); // Gọi hàm onSelect với ID của nhóm ví
  };

  return (
    <div className={`${styles.card} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className={styles.checkbox}
        />
      </div>
      <Link to={`/wallet/wallet-group/${group.id}`} className={styles.cardContent}>
        <h3 className={styles.groupName}>{group.name}</h3>
        <p className={styles.groupDescription}>{group.description || 'Không có mô tả.'}</p>
        <div className={styles.groupStats}>
          {/* <p>Số lượng ví: <strong>{group.walletCount || 0}</strong></p> */}
          <p>Ngày tạo: <strong>{formatToVietnamTime(group.created_at)}</strong></p>
          
          {/* Bạn có thể thêm các thông tin khác như ngày tạo, người tạo */}
        </div>
      </Link>
      <div className={styles.cardActions}>
        <button onClick={() => onEdit(group.id)} className={styles.editButton}>
          Sửa
        </button>
        <button onClick={() => onDelete(group.id)} className={styles.deleteButton}>
          Xóa
        </button>
      </div>
    </div>
  );
};

export default WalletGroupCard;