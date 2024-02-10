import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { addParamsInUrl } from '@/utils/Helpers/common'
import { networkEndpoints } from '@/utils/constants/networkEndpoints'
import networkClient, { NetworkClientInputs } from '@/network/networkClient'
import styles from './QuestLanguages.module.scss'
import LoadingSpinner from '@/components/LoadingSpinner'
import CloseIcon from '@/utils/Icons/Close'
import plusSVG from '@/utils/Icons/Plus.svg'
import Button, { ButtonVariants } from '@/components/Button'
import { Editor } from '@monaco-editor/react'
import ArrowDownIcon from '@/utils/Icons/ArrowDown'
import Modal from '@/components/Modal'
import { initialLanguageCodeBlocks } from '@/utils/constants/initialLanguageCodeBlocks'

type Props = {
  questId: string
}

type QuestLanguage = {
  language: string
  snippet: string
  solution: string
  mainFile: string
}

const QuestLanguages = ({ questId }: Props) => {
  // init
  const languages = ['javascript', 'python']
  const codeEditorChoices = ['snippet', 'solution', 'mainFile']
  const initialLanguageData = {
    language: '',
    snippet: '',
    solution: '',
    mainFile: ''
  }
  const [isLoading, setIsLoading] = useState(true)
  const [addingLanguage, setAddingLanguage] = useState(false)
  const [removingLanguage, setRemovingLanguage] = useState(false)
  const [savingLanguage, setSavingLanguage] = useState(false)
  const [questLanguages, setQuestLanguages] = useState<QuestLanguage[]>([])
  const [currentLanguage, setCurrentLanguage] = useState<QuestLanguage>(questLanguages.length > 0 ? questLanguages[0] : initialLanguageData)
  const [filteredLanguages, setFilteredLanguages] = useState<string[]>(languages)
  const [showLanguageSelection, setShowLanguageSelection] = useState(false)
  const [languageToRemove, setLanguageToRemove] = useState('')
  const [currentOpenEditor, setCurrentOpenEditor] = useState('snippet')

  const changeCurrentLanguage = (newLanguageDetails: QuestLanguage) => {
    const updatedLanguageDetails = questLanguages.map(item => {
      if (item.language === currentLanguage.language) {
        return currentLanguage
      }
      return item
    })
    setQuestLanguages(updatedLanguageDetails)
    setCurrentLanguage(newLanguageDetails)
  }

  const handleAddLanguage = () => {
    setShowLanguageSelection(true)
  }

  const addNewLanguage = (language: string) => {
    setShowLanguageSelection(false)
    setAddingLanguage(true)
    const networkParams = {
      ...networkEndpoints.quest.language.create,
      body: {
        data: [
          {
            language,
            ...initialLanguageCodeBlocks[language]
          }]
      }
    }
    networkParams.endpoint = addParamsInUrl(networkParams.endpoint, questId)

    networkClient(networkParams).then((response) => {
      setAddingLanguage(false)

      if (response?.status === 201) {
        const newLanguageData = response.data.item?.[0]
        toast.success('Language added successfully')
        setQuestLanguages([...questLanguages, newLanguageData])
        setCurrentLanguage(newLanguageData)
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setAddingLanguage(false)
      console.error(err)
      toast.error('Something went wrong while adding new language')
    })
  }

  const openRemoveLanguageModal = (e: any, language: string) => {
    e.stopPropagation()
    setLanguageToRemove(language)
  }

  const closeRemoveLanguageModal = () => {
    setLanguageToRemove('')
  }

  const handleCodeEditorValueChange = (key: string, value: string) => {
    const updatedLanguageDetails = questLanguages.map(item => {
      if (item.language === currentLanguage.language) {
        return {
          ...item,
          [key]: value,
        }
      }
      return item
    })
    setQuestLanguages(updatedLanguageDetails)

    const updatedCurrentLanguageDetails = {
      ...currentLanguage,
      [key]: value,
    }
    setCurrentLanguage(updatedCurrentLanguageDetails)
  }

  const removeLanguageDetails = () => {
    setRemovingLanguage(true)
    const networkParams = {
      ...networkEndpoints.quest.language.delete,
    }
    networkParams.endpoint = addParamsInUrl(networkParams.endpoint, questId, languageToRemove)

    networkClient(networkParams).then((response) => {
      setRemovingLanguage(false)

      if (response?.status === 204) {
        toast.success('Language deleted successfully')
        const updatedLanguageDetails = questLanguages.filter(item => item.language !== languageToRemove)
        setQuestLanguages(updatedLanguageDetails)
        if (currentLanguage.language === languageToRemove) {
          setCurrentLanguage(questLanguages?.[0])
        }
        setLanguageToRemove('')
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setRemovingLanguage(false)
      console.error(err)
      toast.error('Something went wrong while deleting language')
    })
  }

  const fetchLanguageDetails = () => {
    setIsLoading(true)
    const networkParams = { ...networkEndpoints.quest.language.getAll }
    networkParams.endpoint = addParamsInUrl(networkParams.endpoint, questId)

    networkClient(networkParams).then((response) => {
      setIsLoading(false)

      if (response?.status === 200) {
        // transform data to match table requirements
        setQuestLanguages(response.data.item)
        setCurrentLanguage(response.data.item[0])
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setIsLoading(false)
      console.error(err)
      toast.error('Something went wrong')
    })
  }

  const saveLanguageData = () => {
    setSavingLanguage(true)
    const networkParams = {
      ...networkEndpoints.quest.language.update,
      body: {
        snippet: currentLanguage.snippet,
        solution: currentLanguage.solution,
        mainFile: currentLanguage.mainFile
      }
    }
    networkParams.endpoint = addParamsInUrl(networkParams.endpoint, questId, currentLanguage.language)

    networkClient(networkParams).then((response) => {
      setSavingLanguage(false)

      if (response?.status === 200) {
        const res = response.data.item
        const newLanguageData = {
          language: currentLanguage.language,
          snippet: res.snippet,
          solution: res.solution,
          mainFile: res.mainFile
        }
        toast.success('Language details saved successfully')
        const updatedLanguageDetails = questLanguages.map(item => {
          if (item.language === currentLanguage.language) {
            return newLanguageData
          }
          return item
        })
        setQuestLanguages(updatedLanguageDetails)
        setCurrentLanguage(newLanguageData)
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setSavingLanguage(false)
      console.error(err)
      toast.error('Something went wrong while saving language details')
    })
  }

  // fetch quest's languages data on page load
  useEffect(() => {
    fetchLanguageDetails()
  }, [])

  useEffect(() => {
    const filteredLanguages = languages.filter(item => !questLanguages.some(language => language.language === item))
    setFilteredLanguages(filteredLanguages)
  }, [questLanguages])

  if (isLoading) {
    return <div className={styles.LoaderWrapper}>
      <LoadingSpinner />
    </div>
  }

  return <section className={styles.QuestLanguages}>
    <div className={styles.QuestLanguages__TopBar}>
      <nav className={styles.QuestLanguages__Navigation}>
        {questLanguages.map((item, index) => (
          <button key={index}
            onClick={() => changeCurrentLanguage(item)}
            className={item.language === currentLanguage?.language ? styles['QuestLanguages__NavigationActive'] : ''}>
            {item.language}
            <span onClick={(e) => openRemoveLanguageModal(e, item.language)}><CloseIcon /></span>
          </button>
        ))}
      </nav>

      <Button disabled={addingLanguage || filteredLanguages.length === 0} onClick={handleAddLanguage} icon={plusSVG}>Add Language</Button>

      {showLanguageSelection && <div className={styles.QuestLanguages__SelectionPopUp}>
        {filteredLanguages.map((item, index) => (
          <p key={index} onClick={() => addNewLanguage(item)}>{item}</p>
        ))}
      </div>}
    </div>
    {showLanguageSelection && <div className={styles.QuestLanguages__PopUpOverlay} onClick={() => setShowLanguageSelection(false)} />}

    {/* Empty State */}
    {questLanguages.length === 0 && <div className={styles.QuestLanguages__EmptyState}>
      <h4>No languages added yet</h4>
    </div>}

    {questLanguages.length > 0 && <div className={styles.QuestLanguages__CodeSection}>
      <div className={styles.QuestLanguages__CodeSectionLeftSide}>
        <div className={styles.QuestLanguages__CodeSectionButtons}>
          {codeEditorChoices.map((choice) => (
            <button
              key={choice}
              className={currentOpenEditor === choice ? styles.QuestLanguages__CodeSectionActiveButton : ''}
              onClick={() => setCurrentOpenEditor(choice)}>
              {choice}
              {currentOpenEditor === choice && <ArrowDownIcon />}
            </button>
          ))}
        </div>

        <div className={styles.QuestLanguages__SaveButton}>
          <Button disabled={savingLanguage} onClick={saveLanguageData}>Save Changes</Button>
        </div>
      </div>

      {<Editor
        height="550px"
        theme='vs-dark'
        loading={<LoadingSpinner />}
        language={currentLanguage?.language?.toLowerCase()}
        value={currentLanguage?.[currentOpenEditor as keyof QuestLanguage] ?? ''}
        onChange={(value) => handleCodeEditorValueChange(currentOpenEditor, value as string)} />}

    </div>}

    {/* Delete Language Modal */}
    <Modal open={Boolean(languageToRemove)} onClose={closeRemoveLanguageModal}>
      <div className={styles.QuestLanguages__RemoveLanguageModal}>
        <h3>Are you sure you want to delete all details of {languageToRemove} language?</h3>
        <div className={styles.QuestLanguages__ModalBottomBar}>
          <Button variant={ButtonVariants.GRAY} onClick={closeRemoveLanguageModal}>Cancel</Button>
          {removingLanguage && <LoadingSpinner />}
          {!removingLanguage && <Button variant={ButtonVariants.DANGER} onClick={removeLanguageDetails}>Delete</Button>}
        </div>
      </div>
    </Modal>
  </section>
}

export default QuestLanguages
