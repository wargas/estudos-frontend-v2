import { FC } from "react";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import styles from './Loading.module.css';

type Props = {
    show?: boolean
}

const Loading: FC<Props> = ({show = false}) => {

    if(!show) return null;

    return <div className={styles.wrapper}>
        <AiOutlineLoading3Quarters /> 
    </div>
}

export default Loading
