import styles from './Input.module.scss'

type Props = {
  value?: string
  placeholder?: string
  label?: string
  onChange?: (e: any) => void
  onFocusLost?: (e: any) => void
  isError?: boolean
  helperText?: string
}

const Input = ({ value, placeholder, label, onChange, onFocusLost, isError, helperText }: Props) => {

  const onInputChange = (e: any) => {
    if (typeof onChange === 'function') {
      onChange(e.target.value)
    }
  }

  const onInputBlur = (e: any) => {
    if (typeof onFocusLost === 'function') {
      onFocusLost(e.target.value)
    }
  }

  return (
    <div className={styles.Input}>
      {label && <label>{label}</label>}
      <input type="text" className={isError ? styles.Input__Error : ''} placeholder={placeholder} value={value} onChange={onInputChange} onBlur={onInputBlur}/>
      {helperText && <caption className={isError ? styles.Input__ErrorText : ''}>{helperText}</caption>}
    </div>
  );
}

export default Input;
