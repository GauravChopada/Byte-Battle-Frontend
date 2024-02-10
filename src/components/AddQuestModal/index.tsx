'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

import { networkEndpoints } from "@/utils/constants/networkEndpoints"
import { QuestDetails } from "@/app/quests/[questId]/page"
import { TimeUnites, addParamsInUrl, getTimeInMinutes } from "@/utils/Helpers/common"
import Button from "../Button"
import CloseIcon from '../../utils/Icons/Close'
import Modal from "../Modal"
import networkClient from "@/network/networkClient"
import QuestDescription from "./Steps/QuestDescription"
import styles from './AddQuestModal.module.scss'

type Props = {
  open?: boolean
  onClose: () => void
  initialData?: QuestDetails
  setData?: (value: QuestDetails) => void
}

const AddQuestModal = ({ open = false, onClose, initialData, setData }: Props) => {
  // init
  const initialQuestDescription = {
    title: initialData?.title ?? '',
    description: initialData?.description ?? '',
    constraints: initialData?.constraints ?? '',
    difficulty: initialData?.difficulty ?? 'medium',
    timeLimit: initialData?.appropriateTime ?? 30,
    timeLimitFormat: TimeUnites.MINUTES,
    topics: initialData?.topics.map(i => i.name) ?? []
  }

  const router = useRouter()
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true)
  const [questDescription, setQuestDescription] = useState(initialQuestDescription)

  const saveQuestDescription = () => {
    let networkParams = {
      ...networkEndpoints.quest.create,
      body: {
        title: questDescription.title,
        description: questDescription.description,
        constraints: questDescription.constraints,
        difficulty: questDescription.difficulty,
        appropriateTime: getTimeInMinutes(questDescription.timeLimit, questDescription.timeLimitFormat),
        topics: questDescription.topics,
      }
    }

    if (initialData) {
      networkParams = {
        ...networkParams,
        ...networkEndpoints.quest.update,
      }

      networkParams.endpoint = addParamsInUrl(networkParams.endpoint, initialData.id)
    }

    networkClient(networkParams).then((res) => {
      if (res?.status === 201) {
        toast.success('Quest created successfully')
        const questId = res.data.item.id
        router.push(`quests/${questId}`)
      } else if (res?.status === 200) {
        toast.success('Quest updated successfully')
        if (typeof setData === 'function') {
          setData({ ...initialData,  ...res.data.item})
        }
        onClose()
      } else {
        console.error(res)
        toast.error('Something went wrong while saving quest details')
      }
    }).catch((err) => {
      console.error(err)
      toast.error('Something went wrong while saving quest details')
    })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className={styles.AddQuestModal}>

        {/* Top Bar */}
        <section className={styles.AddQuestModal__TopBar}>
          <h1 className={styles.AddQuestModal__Title}>Add New Quest</h1>
          <CloseIcon className={styles.AddQuestModal__CloseIcon} onClick={onClose} />
        </section>

        <QuestDescription data={questDescription} setData={setQuestDescription} setIsSubmitButtonDisabled={setIsSubmitButtonDisabled} />

        {/* Bottom Bar */}
        <section className={styles.AddQuestModal__BottomBar}>
          <Button onClick={saveQuestDescription} disabled={isSubmitButtonDisabled}>Save</Button>
        </section>
      </div>
    </Modal>
  )
}

export default AddQuestModal
