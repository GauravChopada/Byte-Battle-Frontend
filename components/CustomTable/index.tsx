'use client'

import styles from './CustomTable.module.scss'
import TableCell from './TableCell'

type Props = {
  content: Record<string, any>[]
  columns: Record<string, any>[]
  noDataMessage?: string
}

const CustomTable = ({ content, columns, noDataMessage }: Props) => {
  return (
    <div className={styles.CustomTable}>
      <table>
        <thead>
          <tr>
            {columns.map((item, index) => (
              <th key={index}>{item.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {
            content.length === 0 && <tr>
              <td colSpan={columns.length} className={styles.CustomTable__NoData}>{noDataMessage}</td>
            </tr>
          }
          {content.map((item: Record<string, any>, index: number) => (
            <tr key={index}>
              {
                columns.map((column, index) => (
                  <TableCell key={index} type={column.type} column={column.key} columnOptions={column} dataOptions={item} cellData={item[column.key]} />
                ))
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomTable;
