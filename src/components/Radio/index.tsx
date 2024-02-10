import { useState } from 'react';
import styles from './Radio.module.scss';

type Prop = {
  label?: string
  options: string[]
  onChange?: (value: string) => void
  value?: string
}
const Radio = ({ label, options, value, onChange }: Prop) => {
  const [selectedOption, setSelectedOption] = useState(value || options[0])

  const onValueChange = (e: any) => {
    setSelectedOption(e.target.id);
    if (typeof onChange === 'function') {
      onChange(e.target.id);
    }
  }
  
  return (
    <div className={styles.Radio}>
      <label className={styles.Radio__Label}>{label}</label>
      <div onChange={onValueChange} className={styles.Radio__Wrapper}>
        {options.map((option: string, index: number) => (
          <label className={styles.Radio__Container} key={index}>
            <input type="radio" name="radio" id={option} defaultChecked={selectedOption === option} />
            <span className="name">{option}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default Radio;
