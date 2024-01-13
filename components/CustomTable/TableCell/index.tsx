import classNames from 'classnames';
import Image from 'next/image';

import arrowDownSVG from '../../../utils/Icons/ArrowDown.svg';
import LoadingSpinner from '../../LoadingSpinner';
import styles from './TableCell.module.scss'

export enum TableCellTypes {
  SELECT = 'select',
  BUTTON = 'button',
  TEXT = 'text'
}

type Props = {
  type: TableCellTypes
  cellData: {
    value: string
    isLoading?: boolean
    isDisabled?: boolean
  }
  column?: string
  columnOptions?: {
    onSelect?: (e: string, d: any) => void
    onClick?: (d: any) => void
    options?: string[]
  }
  dataOptions?: {
    isLoading?: boolean
    loadingColumn?: string
  }
};

const TableCell = ({ type, cellData, ...otherProps }: Props) => {
  // return loading spinner if isLoading state is provided
  if (cellData?.isLoading) {
    return (
      <td>
        <LoadingSpinner />
      </td>
    )
  }

  switch (type) {
    case TableCellTypes.SELECT:
      const onSelectChange = (e: any) => {
        if (typeof otherProps.columnOptions?.onSelect === 'function') {
          otherProps.columnOptions.onSelect(e.target.value, otherProps.dataOptions)
        }
      }

      return (
        <td>
          <div className={classNames(styles.TableCell__SelectContainer, cellData?.isDisabled ? styles['TableCell__SelectContainer--Disabled'] : '')}>
            <select value={cellData?.value} onChange={onSelectChange}>
              {otherProps.columnOptions?.options?.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
            <Image className={styles.TableCell__IconContainer} src={arrowDownSVG} alt='Change role button' />
          </div>
        </td>
      )

    case TableCellTypes.BUTTON:
      const onButtonClick = () => {
        if (typeof otherProps.columnOptions?.onClick === 'function') {
          otherProps.columnOptions.onClick(otherProps.dataOptions)
        }
      }
      return (
        <td>
          <button type="button" onClick={onButtonClick} className={classNames(styles.TableCell__TextButton, cellData?.isDisabled ? styles['TableCell__TextButton--Disabled'] : '')}>
            {cellData?.value}
          </button>
        </td>
      )

    case TableCellTypes.TEXT:
    default:
      return <td className={styles.TableCell}>{cellData?.value}</td>;
  }
}

export default TableCell;
