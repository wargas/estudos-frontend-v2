import { useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import styles from './PageHeader.module.css';
export type PageHeaderProps = {
  title?: string;
  subtitle?: string;
  children?: any;
  backButton?: boolean;
  isLoading?: boolean;
  onBackPress?: () => void;
};

export function PageHeader({
  title,
  subtitle,
  children,
  backButton = false,
  isLoading = false,
  onBackPress = () => {},
}: PageHeaderProps) {
  useEffect(() => {
    document.title = title || 'App Estudos';

    return () => {
      document.title = 'App Estudos';
    };
  }, [title]);

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingWrapperBackbutton}>
          <h1></h1>
        </div>
        <div className={styles.loadingCenter}>
          <h1 className={styles.loadingTitle}></h1>
          <p className={styles.loadingSubtitle}></p>
        </div>
        <div className={styles.loadingRight}>
          <div className={styles.loadingButtons}></div>
          <div className={styles.loadingButtons}></div>
          <div className={styles.loadingButtons}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {backButton && (
        <button
          onClick={() => onBackPress()}
          className={styles.backbutton}>
          <FaChevronLeft />
        </button>
      )}
      <div className={styles.center}>
        <h1 title={title}>
          {title || '-'}
        </h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className={styles.left}>
        {children}
      </div>
    </div>
  );
}
