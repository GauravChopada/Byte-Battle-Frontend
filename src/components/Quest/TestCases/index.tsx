import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { addParamsInUrl } from '@/utils/Helpers/common'
import { networkEndpoints } from '@/utils/constants/networkEndpoints'
import networkClient, { NetworkClientInputs } from '@/network/networkClient'
import styles from './QuestTestCases.module.scss'
import LoadingSpinner from '@/components/LoadingSpinner'
import DeleteIcon from '@/utils/Icons/Delete'
import ArrowDownIcon from '@/utils/Icons/ArrowDown'
import Input from '@/components/Input'
import CloseIcon from '@/utils/Icons/Close'
import CheckBox from '@/components/CheckBox'
import Button, { ButtonVariants } from '@/components/Button'
import plusSVG from '@/utils/Icons/Plus.svg'
import classNames from 'classnames'
import Modal from '@/components/Modal'

type Props = {
  questId: string
}

type QuestTestCaseType = {
  id: string | null
  questId: string
  inputs: string[]
  output: string
  isSampleTestCase: boolean
  explanation: string
  isTested: boolean
  isTestCasePassed: boolean
}

const QuestTestCases = ({ questId }: Props) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingData, setIsSavingData] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [questTestCases, setQuestTestCases] = useState<QuestTestCaseType[]>([])
  const [deletingTestCaseIndex, setDeletingTestCaseIndex] = useState(-1)
  const [editingTestCaseIndex, setEditingTestCaseIndex] = useState<number>(-1)
  const [currentOpenTestCaseIndex, setCurrentOpenTestCaseIndex] = useState<number>(-1)

  const handleAddTestCase = () => {
    const newTestCase = {
      id: null,
      questId,
      inputs: [''],
      output: '',
      isSampleTestCase: false,
      isTested: false,
      isTestCasePassed: false,
      explanation: '',
    }
    setQuestTestCases([...questTestCases, newTestCase])
    setEditingTestCaseIndex(questTestCases.length)
    setCurrentOpenTestCaseIndex(questTestCases.length)
  }

  const toggleTestCaseAccordion = (index: number) => {
    setEditingTestCaseIndex(-1)
    if (currentOpenTestCaseIndex === index) {
      setCurrentOpenTestCaseIndex(-1)
      return
    }
    setCurrentOpenTestCaseIndex(index)
  }

  const toggleSampleTestCaseValue = () => {
    questTestCases[currentOpenTestCaseIndex].isSampleTestCase = !questTestCases[currentOpenTestCaseIndex].isSampleTestCase
    setQuestTestCases([...questTestCases])
  }

  const addInputField = () => {
    questTestCases[currentOpenTestCaseIndex].inputs.push('')
    setQuestTestCases([...questTestCases])
  }

  const editTestCase = (e: any, index: number) => {
    e.stopPropagation()
    setEditingTestCaseIndex(index)
    setCurrentOpenTestCaseIndex(index)
  }

  const saveTestCase = (index: number) => {
    setIsSavingData(true)
    const currentTestCase = questTestCases[index]
    const body = {
      input: currentTestCase.inputs,
      output: currentTestCase.output,
      isSampleTestCase: currentTestCase.isSampleTestCase,
      explanation: currentTestCase.explanation ? currentTestCase.explanation : undefined
    }

    let networkParams: NetworkClientInputs = {
      ...networkEndpoints.quest.testCase.create,
      body: { data: [body] }
    }
    networkParams.endpoint = addParamsInUrl(networkParams.endpoint, questId)

    if (currentTestCase.id !== null) {
      networkParams = {
        ...networkParams,
        ...networkEndpoints.quest.testCase.update,
        body: body
      } as NetworkClientInputs
      networkParams.endpoint = addParamsInUrl(networkParams.endpoint, questId, currentTestCase.id)
    }

    networkClient(networkParams).then((response) => {
      if (response?.status === 201) {
        const res = response.data.item[0]
        const newTestCase = {
          id: res.id,
          questId: res.questId,
          inputs: res.input,
          output: res.output,
          isSampleTestCase: Boolean(res.isSampleTestCase),
          explanation: res?.explanation,
          isTested: false,
          isTestCasePassed: false
        }
        questTestCases[index] = newTestCase
        setQuestTestCases([...questTestCases])
        toast.success('Test case saved successfully')
        setIsSavingData(false)
      } else if (response?.status === 200) {
        toast.success('Test case updated successfully')
        setIsSavingData(false)
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setIsSavingData(false)
      console.error(err)
      toast.error('Something went wrong while saving test case')
    })
  }

  const closeDeleteModal = () => {
    setDeletingTestCaseIndex(-1)
  }

  const deleteTestCase = (index: number) => {
    const currentTestCase = questTestCases[index]
    setCurrentOpenTestCaseIndex(-1)
    if (currentTestCase.id === null) {
      questTestCases.splice(index, 1)
      setQuestTestCases([...questTestCases])
      return
    }

    setDeletingTestCaseIndex(index)
  }

  const deleteTestCaseFromServer = () => {
    setIsDeleting(true)
    const currentTestCase = questTestCases[deletingTestCaseIndex]
    const networkParams = {
      ...networkEndpoints.quest.testCase.delete,
    }
    networkParams.endpoint = addParamsInUrl(networkParams.endpoint, questId, String(currentTestCase.id))

    networkClient(networkParams).then((response) => {
      if (response?.status === 204) {
        questTestCases.splice(deletingTestCaseIndex, 1)
        setQuestTestCases([...questTestCases])
        setIsDeleting(false)
        closeDeleteModal()
        toast.success('Test case deleted successfully')
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setIsDeleting(false)
      console.error(err)
      toast.error('Something went wrong while deleting test case')
    })
  }

  const removeInputTextField = (index: number) => {
    questTestCases[currentOpenTestCaseIndex].inputs.splice(index, 1)
    setQuestTestCases([...questTestCases])
  }

  const onInputChange = (key: string, value: string | string[] | boolean, i: number = 0) => {
    switch (key) {
      case 'output':
        questTestCases[currentOpenTestCaseIndex].output = value as string
        break
      case 'explanation':
        questTestCases[currentOpenTestCaseIndex].explanation = value as string
        break
      case 'inputs':
        questTestCases[currentOpenTestCaseIndex].inputs[i] = value as string
        break
    }
    setQuestTestCases([...questTestCases])
  }

  const fetchTestCases = () => {
    setIsLoading(true)
    const networkParams = { ...networkEndpoints.quest.testCase.getAll }
    networkParams.endpoint = addParamsInUrl(networkParams.endpoint, questId)

    networkClient(networkParams).then((response) => {
      setIsLoading(false)

      if (response?.status === 200) {
        // transform data to match table requirements
        const formattedTestCases = response.data.item.map((testCase: any) => {
          return {
            id: testCase.id,
            inputs: JSON.parse(testCase.input),
            output: testCase.output,
            isSampleTestCase: Boolean(testCase.isSampleTestCase),
            explanation: testCase.explanation
          }
        })
        setQuestTestCases(formattedTestCases)
      } else {
        throw new Error(response?.data.description)
      }
    }).catch((err) => {
      setIsLoading(false)
      console.error(err)
      toast.error('Something went wrong')
    })
  }

  const testAllTestCases = () => { }
  const testCurrentTestCase = () => { }

  // fetch quest's languages data on page load
  useEffect(() => {
    fetchTestCases()
  }, [])

  if (isLoading) {
    return <div className={styles.LoaderWrapper}>
      <LoadingSpinner />
    </div>
  }

  return <section className={styles.QuestTestCases}>

    {/* Top Bar */}
    <div className={styles.QuestTestCases__TopBar}>
      <h3>Test Cases : <span>{questTestCases.length}</span></h3>
      <div className={styles.QuestTestCases__TopBarRightSide}>
        <Button disabled={questTestCases.length === 0} variant={ButtonVariants.GRAY} onClick={testAllTestCases}>Test All</Button>
        <Button onClick={handleAddTestCase} icon={plusSVG}>Add Test Case</Button>
      </div>
    </div>

    {/* Empty State */}
    {questTestCases.length === 0 && <div className={styles.QuestTestCases__EmptyState}>
      <h4>No Test Cases Found !!</h4>
    </div>}

    {/* Test Cases */}
    <div className={styles.QuestTestCases__TestCasesContainer}>
      {questTestCases.map((item, index) => {
        const isInputDisabled = item.id !== null && editingTestCaseIndex !== index 
        return <div key={index} className={classNames(styles.QuestTestCases__TestCaseItem, currentOpenTestCaseIndex === index ? styles?.['QuestTestCases__TestCaseItem--Active'] : '')}>
          <div className={styles.QuestTestCases__TestCaseItem__TopBar} onClick={() => toggleTestCaseAccordion(index)}>
            <div className={styles.QuestTestCases__TestCaseItem__TopBarLeftSide}>
              <h5>Test Case <span>{index + 1}</span></h5>
              {item.isSampleTestCase && <p>Sample TestCase</p>}
              {item.isTested && <p className={item.isTestCasePassed ? styles['TestCases__TestCaseStatus--Passed'] : styles['TestCases__TestCaseStatus--Failed']}>{item.isTestCasePassed ? 'Passed' : 'Failed'}</p>}
            </div>
            <div className={styles.QuestTestCases__TestCaseItem__TopBarRightSide}>
              {item.id !== null && <button className={styles.QuestTestCases__TestCaseItem__EditButton} onClick={(e) => editTestCase(e, index)}>
                Edit
              </button>}
              <span className={styles.QuestTestCases__TestCaseItem__DeleteIcon} onClick={() => deleteTestCase(index)}>
                <DeleteIcon />
              </span>
              <span className={currentOpenTestCaseIndex === index ? styles.QuestTestCases__TestCaseItem__IconFlip : ''}>
                <ArrowDownIcon />
              </span>
            </div>
          </div>

          {currentOpenTestCaseIndex === index && <div className={styles.QuestTestCases__TestCaseItem__Content}>
            {/* Inputs */}
            {item.inputs.map((inputValue, i) => (
              <div key={i}>
                <Input
                  label={`Input ${i + 1}`}
                  value={inputValue}
                  disabled={isInputDisabled}
                  onChange={(newValue) => onInputChange('inputs', newValue, i)}
                  endAdornment={item.inputs.length > 1 ? <CloseIcon /> : null}
                  onEndAdornmentClick={() => removeInputTextField(i)} />
              </div>
            ))}
            <button className={classNames(styles.QuestTestCases__TestCaseItem__AddTestCaseButton, isInputDisabled ? styles?.['QuestTestCases__TestCaseItem__AddTestCaseButton--Disabled'] : '')} onClick={addInputField}>+ Add Input Field</button>

            {/* Output */}
            <Input
              label='Output'
              disabled={isInputDisabled}
              value={item.output}
              onChange={(newValue) => onInputChange('output', newValue)} />

            {/* Sample TestCase CheckBox */}
            <div className={styles.QuestTestCases__TestCaseItem__CheckBoxWrapper} onChange={toggleSampleTestCaseValue}>
              <CheckBox
                label='Is sample test case ?'
                disabled={isInputDisabled}
                value={item.isSampleTestCase} />
            </div>

            {/* Explanation */}
            <Input
              isTextArea
              disabled={isInputDisabled}
              label='Explanation'
              value={item.explanation}
              onChange={(newValue) => onInputChange('explanation', newValue)} />

            <div className={styles.QuestTestCases__TestCaseItem__TestButton}>
              <Button variant={ButtonVariants.GRAY} onClick={testCurrentTestCase}>Test</Button>
              {isSavingData && <LoadingSpinner />}
              {!isSavingData && <Button disabled={isInputDisabled} onClick={() => saveTestCase(index)}>Save</Button>}
            </div>
          </div>}
        </div>
      })}
    </div>

    {/* Delete Test Case Modal */}
    <Modal open={deletingTestCaseIndex >= 0} onClose={closeDeleteModal}>
      <div className={styles.QuestTestCases__RemoveLanguageModal}>
        <h3>Are you sure you want to delete this test case</h3>
        <div className={styles.QuestTestCases__ModalBottomBar}>
          <Button variant={ButtonVariants.GRAY} onClick={closeDeleteModal}>Cancel</Button>
          {isDeleting && <LoadingSpinner />}
          {!isDeleting && <Button variant={ButtonVariants.DANGER} onClick={deleteTestCaseFromServer}>Delete</Button>}
        </div>
      </div>
    </Modal>
  </section>
}

export default QuestTestCases
