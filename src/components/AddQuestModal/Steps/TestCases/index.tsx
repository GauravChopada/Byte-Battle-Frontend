import Button, { ButtonVariants } from '../../../Button'
import styles from './TestCases.module.scss'
import plusSVG from '../../../../utils/Icons/Plus.svg'
import ArrowDownIcon from '../../../../utils/Icons/ArrowDown'
import { useEffect, useState } from 'react'
import Input from '../../../Input'
import CheckBox from '../../../CheckBox'
import DeleteIcon from '../../../../utils/Icons/Delete'
import CloseIcon from '../../../../utils/Icons/Close'

export interface TestCaseObjectFormat {
  inputs: string[]
  output: string
  isSampleTestCase: boolean
  isTested: boolean
  isTestCasePassed: boolean
  explanation: string
}

type Props = {
  data: TestCaseObjectFormat[]
  setData: (value: TestCaseObjectFormat[]) => void
  setIsSubmitButtonDisabled: (value: boolean) => void
}

const TestCases = ({ data: testCasesData, setData: setTestCasesData, setIsSubmitButtonDisabled }: Props) => {

  const [currentOpenTestCaseIndex, setCurrentOpenTestCaseIndex] = useState<number>(0)

  const handleAddTestCase = () => {
    const newTestCase = {
      inputs: [''],
      output: '',
      isSampleTestCase: false,
      isTested: false,
      isTestCasePassed: false,
      explanation: '',
    }
    setTestCasesData([...testCasesData, newTestCase])
    setCurrentOpenTestCaseIndex(testCasesData.length)
  }

  const toggleSampleTestCaseValue = () => {
    testCasesData[currentOpenTestCaseIndex].isSampleTestCase = !testCasesData[currentOpenTestCaseIndex].isSampleTestCase
    setTestCasesData([...testCasesData])
  }

  const toggleTestCaseAccordion = (index: number) => {
    if (currentOpenTestCaseIndex === index) {
      setCurrentOpenTestCaseIndex(-1)
      return
    }
    setCurrentOpenTestCaseIndex(index)
  }

  const addInputField = () => {
    testCasesData[currentOpenTestCaseIndex].inputs.push('')
    setTestCasesData([...testCasesData])
  }

  const deleteTestCase = (index: number) => {
    testCasesData.splice(index, 1)
    setTestCasesData([...testCasesData])
  }

  const removeInputTextField = (index: number) => {
    testCasesData[currentOpenTestCaseIndex].inputs.splice(index, 1)
    setTestCasesData([...testCasesData])
  }

  const onInputChange = (key: string, value: string | string[] | boolean, i: number = 0) => {
    switch (key) {
      case 'output':
        testCasesData[currentOpenTestCaseIndex].output = value as string
        break
      case 'explanation':
        testCasesData[currentOpenTestCaseIndex].explanation = value as string
        break
      case 'inputs':
        testCasesData[currentOpenTestCaseIndex].inputs[i] = value as string
        break
    }
    setTestCasesData([...testCasesData])
  }

  // TODO: Implement this
  const testAllTestCases = () => { }

  const testCurrentTestCase = () => { }

  useEffect(() => {
    const isAtLeastOneTestCasePresent = testCasesData.length > 0
    const isAllTestCasesTested = testCasesData.every(item => item.isTested && item.isTestCasePassed)
    setIsSubmitButtonDisabled(!isAtLeastOneTestCasePresent || !isAllTestCasesTested)
  })

  return (
    <section className={styles.TestCases}>
      {/* Top Bar */}
      <div className={styles.TestCases__TopBar}>
        <h3>Test Cases : <span>{testCasesData.length}</span></h3>
        <div className={styles.TestCases__TopBarRightSide}>
          <Button disabled={testCasesData.length === 0} variant={ButtonVariants.GRAY} onClick={testAllTestCases}>Test All</Button>
          <Button onClick={handleAddTestCase} icon={plusSVG}>Add Test Case</Button>
        </div>
      </div>

      {/* Empty State */}
      {testCasesData.length === 0 && <div className={styles.TestCases__EmptyState}>
        <h4>No Test Cases added yet</h4>
      </div>}

      {/* Test Cases */}
      <div className={styles.TestCases__TestCasesContainer}>
        {testCasesData.map((item, index) => (
          <div key={index} className={styles.TestCases__TestCaseItem}>

            <div className={styles.TestCases__TestCaseItem__TopBar} onClick={() => toggleTestCaseAccordion(index)}>
              <div className={styles.TestCases__TestCaseItem__TopBarLeftSide}>
                <h5>Test Case <span>{index + 1}</span></h5>
                {item.isSampleTestCase && <p>Sample TestCase</p>}
                {item.isTested && <p className={item.isTestCasePassed ? styles['TestCases__TestCaseStatus--Passed'] : styles['TestCases__TestCaseStatus--Failed']}>{item.isTestCasePassed ? 'Passed' : 'Failed'}</p>}
              </div>
              <div className={styles.TestCases__TestCaseItem__TopBarRightSide}>
                <span className={styles.TestCases__TestCaseItem__DeleteIcon} onClick={() => deleteTestCase(index)}>
                  <DeleteIcon />
                </span>
                <span className={currentOpenTestCaseIndex === index ? styles.TestCases__TestCaseItem__IconFlip : ''}>
                  <ArrowDownIcon />
                </span>
              </div>
            </div>

            {currentOpenTestCaseIndex === index && <div className={styles.TestCases__TestCaseItem__Content}>
              {/* Inputs */}
              {item.inputs.map((inputValue, i) => (
                <div key={i}>
                  <Input
                    label={`Input ${i + 1}`}
                    value={inputValue}
                    onChange={(newValue) => onInputChange('inputs', newValue, i)}
                    endAdornment={item.inputs.length > 1 ? <CloseIcon /> : null}
                    onEndAdornmentClick={() => removeInputTextField(i)} />
                </div>
              ))}
              <button className={styles.TestCases__TestCaseItem__AddTestCaseButton} onClick={addInputField}>+ Add Input Field</button>

              {/* Output */}
              <Input
                label='Output'
                value={item.output}
                onChange={(newValue) => onInputChange('output', newValue)} />

              {/* Sample TestCase CheckBox */}
              <div className={styles.TestCases__TestCaseItem__CheckBoxWrapper} onChange={toggleSampleTestCaseValue}>
                <CheckBox
                  label='Is sample test case ?'
                  value={item.isSampleTestCase} />
              </div>

              {/* Explanation */}
              <Input
                isTextArea
                label='Explanation'
                value={item.explanation}
                onChange={(newValue) => onInputChange('explanation', newValue)} />

              <div className={styles.TestCases__TestCaseItem__TestButton}>
                <Button onClick={testCurrentTestCase}>Test</Button>
              </div>
            </div>}
          </div>
        ))}
      </div>
    </section>
  )
}

export default TestCases;
