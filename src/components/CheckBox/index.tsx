import styles from './CheckBox.module.scss'

type Props = {
  label: string
  value?: boolean
  onChange?: (value: boolean) => void
  disabled?: boolean
}

const CheckBox = ({ label, value = false, onChange, disabled = false }: Props) => {

  const onValueChange = (e: any) => {
    if (disabled) {
      return
    }

    if (typeof onChange === 'function') {
      onChange(Boolean(e.target.checked))
    }
  }

  return (
    <div className={styles.CheckBox} >
      <label htmlFor={label}>{label}</label>
      <input type="checkbox" className={disabled ? styles.CheckBox__Disabled : ''} id={label} checked={value} onChange={onValueChange} />
    </div >
  )
}

export default CheckBox;
