import { ReactNode } from "react";
import classNames from "classnames";
import Image from "next/image";

import styles from "./Button.module.scss";

export enum ButtonVariants {
  PRIMARY = 'Primary',
  GRAY = 'Gray',
  DANGER = 'Danger'
}

type Props = {
  children: ReactNode | string;
  onClick: () => void;
  icon?: string;
  disabled?: boolean;
  variant?: ButtonVariants;
}

const Button = ({ children, onClick, icon, disabled=false, variant = ButtonVariants.PRIMARY }: Props) => {
  const onButtonClick = () => {
    if (typeof onClick === 'function' && !disabled) {
      onClick()
    }
  }

  return (
    <button className={classNames(styles.Button, styles[`Button--${variant}`]  ,disabled ? styles.Button__Disabled : '')} onClick={onButtonClick}>
      {icon && <Image className={styles.Button__Icon} src={icon} alt={ typeof children === 'string' ? children : 'button'}/>}
      {children}
    </button>
  )
}

export default Button
