import { ReactNode } from "react";
import classNames from "classnames";
import Image from "next/image";

import styles from "./Button.module.scss";

type Props = {
  children: ReactNode | string;
  onClick: () => void;
  icon?: string;
  disabled?: boolean;
}

const Button = ({ children, onClick, icon, disabled=false }: Props) => {
  return (
    <button className={classNames([styles.Button, disabled ? styles.Button__Disabled : ''])} onClick={onClick}>
      {icon && <Image className={styles.Button__Icon} src={icon} alt={ typeof children === 'string' ? children : 'button'}/>}
      {children}
    </button>
  )
}

export default Button
