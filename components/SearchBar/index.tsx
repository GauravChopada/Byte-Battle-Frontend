import Image from "next/image"

import styles from './SearchBar.module.scss'
import searchSVG from '../../utils/Icons/Search.svg'

type Props = {
  value?: string
  onChange?: (e: any) => void
}

const SearchBar = ({ value, onChange }: Props) => {

  const onInputChange = (e: any) => {
    if (typeof onChange === 'function') {
      onChange(e.target.value)
    }
  }

  return <div className={styles.SearchBar}>
    <input type="text" placeholder="Search" value={value} onChange={onInputChange} />
    <button type="submit">
      <Image src={searchSVG} alt="search users" />
    </button>
  </div>
}

export default SearchBar
