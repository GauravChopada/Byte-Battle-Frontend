import type { ReactNode } from 'react';
import classNames from 'classnames';

import styles from './Chip.module.scss';
import CloseIcon from '../../utils/Icons/Close';

export enum ChipTypes {
  DEFAULT = 'default',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  WARNING = 'warning',
  DANGER = 'danger',
  INFO = 'info',
  LIGHT = 'light',
  DARK = 'dark'
}

type Props = {
  children: ReactNode
  type?: ChipTypes
  onDelete?: () => void
}

const Chip = ({ children, type, onDelete }: Props) => {
  return (
    <div className={classNames(styles.Chip, type !== undefined ? styles[`Chip--${type}`] : '')}>
      {children}
      {typeof onDelete === 'function' && <CloseIcon onClick={onDelete}/>}
    </div>
  )
}

export default Chip;
