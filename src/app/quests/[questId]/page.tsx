'use client'

import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import { addParamsInUrl } from "@/utils/Helpers/common"
import { networkEndpoints } from "@/utils/constants/networkEndpoints"
import { useRouter } from "next/navigation"
import AddQuestModal from "@/components/AddQuestModal"
import Button, { ButtonVariants } from "@/components/Button"
import LoadingSpinner from "@/components/LoadingSpinner"
import Modal from "@/components/Modal"
import networkClient, { NetworkClientInputs } from "@/network/networkClient"
import QuestDescription from "@/components/Quest/Description"
import QuestDetailsCard from "@/components/QuestDetailsCard"
import QuestLanguages from "@/components/Quest/Languages"
import QuestTestCases from "@/components/Quest/TestCases"
import QuestUsers from "@/components/Quest/Users"
import styles from './styles.module.scss'

type Props = {
  params: {
    questId: string
  }
}

export type TopicInstance = {
  id: string
  name: string
}

export type QuestDetails = {
  id: string
  title: string
  description: string
  constraints: string
  difficulty: string
  appropriateTime: number
  topics: TopicInstance[]
}

const QuestDetailsPage = ({ params }: Props) => {
  // init
  const questId = params.questId
  const navigationTabs = ['Description', 'Languages', 'Test Cases', 'Users']
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [deletingQuest, setDeletingQuest] = useState(false)
  const [questDetails, setQuestDetails] = useState<QuestDetails>()
  const [activeTab, setActiveTab] = useState(navigationTabs[0].toLowerCase())
  const [isUpdateQuestModalOpen, setIsUpdateQuestModalOpen] = useState(false)
  const [isDeleteQuestModalOpen, setIsDeleteQuestModalOpen] = useState(false)

  const openUpdateModal = () => {
    setIsUpdateQuestModalOpen(true)
  }

  const openDeleteModal = () => {
    setIsDeleteQuestModalOpen(true)
  }

  const onNavigationItemClick = (e: any) => {
    setActiveTab(e.target.id)
  }

  const fetchQuestDetails = () => {
    setIsLoading(true)
    const networkParams = { ...networkEndpoints.quest.getById } as NetworkClientInputs
    networkParams.endpoint = addParamsInUrl(networkParams.endpoint, questId)

    networkClient(networkParams).then((response) => {
      setIsLoading(false)

      if (response?.status === 200) {
        // transform data to match table requirements
        setQuestDetails(response.data.item)
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setIsLoading(false)
      console.error(err)
      toast.error('Something went wrong')
    })
  }

  const deleteCurrentQuest = () => {
    setDeletingQuest(true)
    const networkParams = { ...networkEndpoints.quest.delete }
    networkParams.endpoint = addParamsInUrl(networkParams.endpoint, questId)

    networkClient(networkParams).then((response) => {
      setDeletingQuest(false)
      if (response?.status === 204) {
        toast.success('Quest deleted successfully')
        router.push('/quests')
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setDeletingQuest(false)
      console.error(err)
      toast.error('Something went wrong')
    })
  }

  // fetch quest's data on page load
  useEffect(() => {
    fetchQuestDetails()
  }, [])

  // show loading spinner while data is fetching 
  if (isLoading || questDetails === undefined) {
    return <main className={styles.QuestDetails}>
      <div className={styles.QuestDetails__LoadingSpinner}>
        <LoadingSpinner />
      </div>
    </main>
  }

  return <main className={styles.QuestDetails}>
    <section className={styles.QuestDetails__TopBar}>
      <QuestDetailsCard {...questDetails} />
      <div className={styles.QuestDetails__TopBarActionButtons}>
        <Button onClick={openUpdateModal}>Update</Button>
        <Button variant={ButtonVariants.DANGER} onClick={openDeleteModal}>Delete</Button>
      </div>
    </section>

    <section className={styles.QuestDetails__NavigationBar}>
      {navigationTabs.map((tab) => (
        <button
          key={tab.toLowerCase()}
          id={tab.toLowerCase()}
          onClick={onNavigationItemClick}
          className={activeTab === tab.toLowerCase() ? styles.QuestDetails__ActiveTab : ''}
        >
          {tab}
        </button>
      ))}
    </section>

    {/* Tabs */}
    {activeTab === 'description' && <QuestDescription {...questDetails} />}
    {activeTab === 'languages' && <QuestLanguages questId={questDetails.id} />}
    {activeTab === 'test cases' && <QuestTestCases questId={questDetails.id} />}
    {activeTab === 'users' && <QuestUsers />}

    {/* Update Quest Details Modal */}
    <AddQuestModal
      initialData={questDetails}
      setData={setQuestDetails}
      open={isUpdateQuestModalOpen}
      onClose={() => setIsUpdateQuestModalOpen(false)} />

    {/* Delete Quest Modal */}
    <Modal open={isDeleteQuestModalOpen} onClose={() => setIsDeleteQuestModalOpen(false)}>
      <div className={styles.QuestDetails__RemoveLanguageModal}>
        <h3>Are you sure you want to delete current Quest?</h3>
        <div className={styles.QuestDetails__ModalBottomBar}>
          <Button variant={ButtonVariants.GRAY} onClick={() => setIsDeleteQuestModalOpen(false)}>Cancel</Button>
          {deletingQuest && <LoadingSpinner />}
          {!deletingQuest && <Button variant={ButtonVariants.DANGER} onClick={deleteCurrentQuest}>Delete</Button>}
        </div>
      </div>
    </Modal>
  </main>
}

export default QuestDetailsPage
