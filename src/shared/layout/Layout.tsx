import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header';
import styles from './Layout.module.css';
import Sidebar from './sidebar';

export default function Layout(props: any) {
  const [showMenu, setShowMenu] = useState(false);

  const { pathname } = useLocation()

  useEffect(() => {
    setShowMenu(false)
  }, [pathname])

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Header toggleSidebar={() => setShowMenu(!showMenu)} />
        <div className={[styles.main, 'scroll'].join(' ')}>
          <Outlet />
        </div>
      </div>
      {showMenu && (
        <div
          onClick={() => setShowMenu(false)}
          className={styles.backdrop}></div>
      )}
      <Sidebar showMenu={showMenu} />
    </div>
  );
}
