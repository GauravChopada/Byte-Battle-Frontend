'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { formatTimeInHourMinutes } from '@/utils/Helpers/common'
import { networkEndpoints } from '@/utils/constants/networkEndpoints'
import { TableCellTypes } from '@/components/CustomTable/TableCell'
import { useRouter } from 'next/navigation'
import AddQuestModal from '@/components/AddQuestModal'
import Button from '@/components/Button'
import CustomTable from '@/components/CustomTable'
import LoadingSpinner from '@/components/LoadingSpinner'
import networkClient from '@/network/networkClient'
import plusSVG from '@/utils/Icons/Plus.svg'
import SearchBar from '@/components/SearchBar'
import styles from './quests.module.scss'

const QuestsPage = () => {
  // init
  const router = useRouter()
  const [searchBarValue, setSearchBarValue] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isAddQuestModalOpen, setIsAddQuestModalOpen] = useState(false)
  const [originalTableData, setOriginalTableData] = useState<any>([])
  const [tableData, setTableData] = useState<any>([])

  const tableColumns = [
    {
      name: 'Quest Title',
      key: 'title',
      type: TableCellTypes.TEXT
    },
    {
      name: 'Difficulty Level',
      key: 'difficulty',
      type: TableCellTypes.CHIP
    },
    {
      name: 'Time Required',
      key: 'appropriateTime',
      type: TableCellTypes.TEXT
    },
    {
      name: 'Topics',
      key: 'topics',
      type: TableCellTypes.MULTIPLE_CHIPS,
    }
  ]

  const openAddQuestModal = () => { setIsAddQuestModalOpen(true) }

  const closeAddQuestModal = () => { setIsAddQuestModalOpen(false) }

  // filter table data based on search bar value
  const onSearchBarValueChange = (newValue: string) => {
    setSearchBarValue(newValue)
    const tempTableData = originalTableData.filter((quest: any) => quest.title.value.toLowerCase().includes(newValue.toLowerCase()) || quest.topics.value.some((topic: string) => topic.toLowerCase().includes(newValue.toLowerCase())))
    setTableData(tempTableData)
  }

  // navigate to quest details page on table row click
  const onQuestClick = (questData: Record<string, any>) => {
    router.push(`/quests/${questData.id.value}`)
  }

  // fetch quests data
  const fetchQuests = () => {
    setIsLoading(true)
    const networkParams = { ...networkEndpoints.quest.getAll }

    networkClient(networkParams).then((response) => {
      setIsLoading(false)

      if (response?.status === 200) {
        // transform data to match table requirements
        const tableData = response.data.item.map((item: any) => {
          const transformedItem: Record<string, unknown> = {};

          Object.keys(item).forEach((key) => {
            transformedItem[key] = { value: item[key] };
          });

          transformedItem.topics = { value: item.topics.map((ele: any) => ele.name) }
          transformedItem.appropriateTime = { value: formatTimeInHourMinutes(item.appropriateTime) }

          return transformedItem;
        })

        setOriginalTableData(tableData)
        setTableData(tableData)
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setOriginalTableData([])
      setTableData([])
      setIsLoading(false)
      console.error(err)
      toast.error('Something went wrong')
    })
  }

  // fetch quest data on page load
  useEffect(() => {
    fetchQuests()
  }, [])

  return <main className={styles.Quests}>
    {/* Top Bar */}
    <section className={styles.Quests__TopBar}>
      <div className={styles.Quests__ContentInfo}>
        <h1>Quests</h1>
        <h3>List of Coding Questions</h3>
        <SearchBar value={searchBarValue} onChange={onSearchBarValueChange} />
      </div>
      <Button onClick={openAddQuestModal} icon={plusSVG}>Add New Quest</Button>
    </section>

    <section className={styles.Quests__TableContainer}>
      {/* show loading spinner while data is fetching */}
      {isLoading && <div className={styles.Quests__LoadingSpinner}>
        <LoadingSpinner />
      </div>}

      {/* render Quests data in table once API responds */}
      {!isLoading && <CustomTable columns={tableColumns} content={tableData} onRowClick={onQuestClick} noDataMessage='No Quests Found !!'/>}
    </section>

    {/* Add Quest Modal */}
    <AddQuestModal open={isAddQuestModalOpen} onClose={closeAddQuestModal}/>
  </main>
}

export default QuestsPage
