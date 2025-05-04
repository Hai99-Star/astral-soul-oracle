import React from 'react';
import LoadingStar from './LoadingStar';
import styles from '@/styles/components/tarot/ShufflingAnimation.module.css';

/**
 * Component hiển thị animation xáo bài
 */
const ShufflingAnimation: React.FC = () => {
  return (
    <div className={styles.shufflingContainer}>
      <LoadingStar text="Đang xáo bài..." />
      <p className={styles.message}>
        Tập trung vào câu hỏi của bạn trong khi bài đang được xáo...
      </p>
    </div>
  );
};

export default ShufflingAnimation; 