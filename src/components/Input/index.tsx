import { ReactNode, useState } from 'react'
import styles from './Input.module.scss'
import Chip, { ChipTypes } from '../Chip'
import classNames from 'classnames'

export enum InputTypes {
  TEXT = 'text',
  NUMBER = 'number'
}

type Props = {
  value?: string | number
  placeholder?: string
  label?: string
  onChange?: (value: string | string[]) => void
  onFocusLost?: (value: string) => void
  isError?: boolean
  disabled?: boolean
  helperText?: string
  isTextArea?: boolean
  lineCount?: number
  type?: InputTypes
  options?: string[]
  selectedOptions?: string[]
  endAdornment?: unknown
  onEndAdornmentClick?: () => void
}

const Input = (props: Props) => {
  const { value, placeholder, label, type = InputTypes.TEXT, options, selectedOptions: initialSelectedOptions = [], onChange, onFocusLost, isError, disabled=false, helperText, isTextArea = false, lineCount = 3, endAdornment, onEndAdornmentClick } = props
  const [inputValue, setInputValue] = useState(value || '')
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialSelectedOptions)
  const initialFilteredOptions = options?.filter(option => !initialSelectedOptions.some(ele => ele === option)) || []
  const [filteredOptions, setFilteredOptions] = useState<string[]>(initialFilteredOptions)
  const [isFocused, setIsFocused] = useState(false)

  const onInputChange = (e: any) => {
    if (disabled) {
      return
    }

    const value = e.target.value
    setInputValue(value)
    setFilteredOptions(options?.filter(option => option.toLowerCase().includes(value.toLowerCase()) && !selectedOptions.some(ele => ele === option)) || [])
    if (typeof onChange === 'function' && options === undefined) {
      onChange(value)
    }
  }

  const onInputBlur = (e: any) => {
    // setIsFocused(false)
    if (typeof onFocusLost === 'function') {
      onFocusLost(e.target.value)
    }
  }

  const onOptionClick = (option: string) => {
    const updatedSelectedOptions = [...selectedOptions, option]
    setSelectedOptions(updatedSelectedOptions)
    setFilteredOptions(options?.filter(opt => !updatedSelectedOptions.some(ele => ele === opt)) || [])

    if (typeof onChange === 'function') {
      onChange(updatedSelectedOptions)
    }

    setInputValue('')
    setIsFocused(false)
  }

  const onInputFocus = () => { setIsFocused(true) }

  const onSelectedOptionDelete = (option: string) => {
    setSelectedOptions(selectedOptions.filter(selectedOption => selectedOption !== option))
  }

  return (
    <div className={styles.Input}>
      {label && <label>{label}</label>}

      <div className={styles.Input__Wrapper}>
        {/* Input */}
        {isTextArea && <textarea rows={lineCount} className={classNames(isError ? styles.Input__Error : '', disabled ? styles.Input__Disabled : '')} placeholder={placeholder} value={value ?? inputValue} onChange={onInputChange} onBlur={onInputBlur} onFocus={onInputFocus} />}
        {!isTextArea && <input type={type} className={classNames(isError ? styles.Input__Error : '', disabled ? styles.Input__Disabled : '')} placeholder={placeholder} value={value ?? inputValue} onChange={onInputChange} onBlur={onInputBlur} onFocus={onInputFocus} />}

        <button type="button" className={disabled ? styles.Input__ButtonDisabled : ''} onClick={disabled ? undefined : onEndAdornmentClick}>
          {endAdornment as ReactNode}
        </button>
      </div>

      {/* Options */}
      {isFocused && <div id='options' className={styles.Input__OptionsWrapper}>
        {filteredOptions && filteredOptions.length > 0 && <ul className={styles.Input__Options}>
          {filteredOptions.map((option, index) => <li key={index} onClick={() => onOptionClick(option)}>{option}</li>)}
        </ul>}
      </div>}

      {/* Selected Options */}
      {selectedOptions && selectedOptions.length > 0 && <div className={styles.Input__SelectedOptions}>
        {selectedOptions.map((option, index) => <Chip key={index} type={ChipTypes.DEFAULT} onDelete={() => onSelectedOptionDelete(option)}>{option}</Chip>)}
      </div>}

      {Boolean(helperText) && <caption className={isError ? styles.Input__ErrorText : ''}>{helperText}</caption>}
    </div>
  );
}

export default Input;
