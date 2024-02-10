import classNames from 'classnames';
import Image from 'next/image';

import ArrowDown from '../../../utils/Icons/ArrowDown';
import LoadingSpinner from '../../LoadingSpinner';
import styles from './TableCell.module.scss'
import Chip, { ChipTypes } from '../../Chip';
import { getChipType } from '@/utils/Helpers/common';

export enum TableCellTypes {
  SELECT = 'select',
  BUTTON = 'button',
  CHIP = 'chip',
  MULTIPLE_CHIPS = 'multiple_chips',
  TEXT = 'text'
}

type Props = {
  type: TableCellTypes
  cellData: {
    value: string | string[]
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
            <ArrowDown />
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

    case TableCellTypes.CHIP:
      return (
        <td>
          <Chip type={getChipType(cellData?.value as string)}>
            {cellData?.value}
          </Chip>
        </td>
      )

    case TableCellTypes.MULTIPLE_CHIPS:
      const firstThreeChips = cellData?.value?.slice(0, 3)
      return (
        <td className={styles.TableCell}>
          <div className={styles.TableCell__MultiChipContainer}>
            {typeof firstThreeChips === 'object' && firstThreeChips?.map((item: string, index: number) => (
              <Chip key={index} type={ChipTypes.DEFAULT}>
                {item}
              </Chip>
            ))}
            {cellData?.value?.length > 3 && <span>+{cellData?.value?.length - 3}</span>}
          </div>
        </td>
      )

    case TableCellTypes.TEXT:
    default:
      return <td className={styles.TableCell__Text}>{cellData?.value}</td>;
  }
}

export default TableCell;
