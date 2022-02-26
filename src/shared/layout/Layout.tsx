import Header from './header';
import styles from './Layout.module.css';
import Sidebar from './sidebar';


export default function (props: any) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <Header />
        <div className={[styles.main, 'scroll'].join(' ')}>          
          {props.children}
        </div>
      </div>
      <Sidebar />
    </div>
  );
}
