import { IconType } from 'react-icons';
import { NavLink } from 'react-router-dom';
import styles from './MenuItem.module.css';

type MenuItemProps = {
  Icon: IconType;
  link: string;
  title: string;
};

export const MenuItem: React.FC<MenuItemProps> = ({Icon, title, link}) => {
  return (
    <li className={styles.wrapper}>
      <NavLink
        className={({isActive}) => `${isActive && styles.active} ${styles.item}`}
        to={link}
        >
        <Icon className={styles.icon} />
        <span>{title}</span>
      </NavLink>
    </li>
  );
};
