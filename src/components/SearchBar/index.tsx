import styles from './SearchBar.module.scss'
import SearchIcon from "../../utils/Icons/Search"

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
      <SearchIcon />
    </button>
  </div>
}

export default SearchBar
