import { FC } from 'react';
import { FaBars, FaBell, FaCog } from 'react-icons/fa';
import styles from './Header.module.css';

type Props = {
  toggleSidebar: () => void;
};

const Header: FC<Props> = ({ toggleSidebar }) => {
  return (
    <div className={styles.wrapper}>
      <div
        id={styles.toggleButton}
        onClick={toggleSidebar}
        className={styles.Button}>
        <FaBars  />
      </div>
      <div className={styles.Divider}></div>
      <div className={styles.Button}>
        <FaBell  />
      </div>
      <div className={styles.Button}>
        <FaCog  />
      </div>
    </div>
  );
};

export default Header;
