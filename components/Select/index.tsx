import classNames from 'classnames';
import Image from "next/image"

import arrowDownSVG from '../../utils/Icons/ArrowDown.svg';
import styles from './Select.module.scss'

type Props = {
  onSelect?: (e: string) => void
  label?: string
  value?: string
  options?: string[]
  disabled?: boolean
}

const Select = ({ label, onSelect, value, options = [], disabled=false }: Props) => {

  const onSelectChange = (e: any) => {
    if (typeof onSelect === 'function') {
      onSelect(e.target.value)
    }
  }

  return (
    <div className={styles.Select}>
      {label && <label>{label}</label>}
      <div className={classNames([styles.Select__Container, disabled ? styles.Select__Disabled: ''])}>
        <select value={value} onChange={onSelectChange}>
          {options?.map((item, index) => (
            <option key={index}>{item}</option>
          ))}
        </select>
        <Image src={arrowDownSVG} alt='select' />
      </div>
    </div>
  )
}

export default Select
