import { Editor } from '@monaco-editor/react';
import { useEffect, useState } from 'react';

import Button from '../../../Button';
import CloseIcon from '../../../../utils/Icons/Close';
import plusSVG from '../../../../utils/Icons/Plus.svg'
import styles from './Language.module.scss'

export interface LanguageObjectFormat {
  language: string
  snippet: string
  solution: string
}

type Props = {
  data: LanguageObjectFormat[]
  setData: (value: LanguageObjectFormat[]) => void
  setIsSubmitButtonDisabled: (value: boolean) => void
}

const Language = ({ data: languageDetails, setData: setLanguageDetails, setIsSubmitButtonDisabled }: Props) => {
  const languages = ['javascript', 'python']
  const initialLanguageData = {
    language: '',
    snippet: '',
    solution: '',
  }

  const [filteredLanguages, setFilteredLanguages] = useState<string[]>(languages)
  const [currentLanguage, setCurrentLanguage] = useState<LanguageObjectFormat>(languageDetails.length > 0 ? languageDetails[0] : initialLanguageData)
  const [showLanguageSelection, setShowLanguageSelection] = useState(false)

  const handleAddLanguage = () => {
    setShowLanguageSelection(true)
  }

  const handleCodeEditorValueChange = (key: string, value: string) => {
    const updatedLanguageDetails = languageDetails.map(item => {
      if (item.language === currentLanguage.language) {
        return {
          ...item,
          [key]: value,
        }
      }
      return item
    })
    setLanguageDetails(updatedLanguageDetails)

    const updatedCurrentLanguageDetails = {
      ...currentLanguage,
      [key]: value,
    }
    setCurrentLanguage(updatedCurrentLanguageDetails)
  }

  const addNewLanguage = (language: string) => {
    const newLanguage = {
      ...initialLanguageData,
      language,
    }

    setLanguageDetails([...languageDetails, newLanguage])
    setCurrentLanguage(newLanguage)
    setShowLanguageSelection(false)
  }

  const removeExistingLanguage = (e: any, language: string) => {
    e.stopPropagation()
    const updatedLanguageDetails = languageDetails.filter(item => item.language !== language)

    setLanguageDetails(updatedLanguageDetails)

    if (currentLanguage.language === language) {
      setCurrentLanguage(languageDetails[0])
    }
  }

  const changeCurrentLanguage = (newLanguageDetails: LanguageObjectFormat) => {
    const updatedLanguageDetails = languageDetails.map(item => {
      if (item.language === currentLanguage.language) {
        return currentLanguage
      }
      return item
    })
    setLanguageDetails(updatedLanguageDetails)
    setCurrentLanguage(newLanguageDetails)
  }

  useEffect(() => {
    const filteredLanguages = languages.filter(item => !languageDetails.some(language => language.language === item))
    setFilteredLanguages(filteredLanguages)
  }, [languageDetails])

  useEffect(() => {
    const isAnyLanguageDetailsEmpty = languageDetails.some(item => item.language === '' || item.snippet === '' || item.solution === '')
    if (languageDetails.length === 0 || isAnyLanguageDetailsEmpty) {
      setIsSubmitButtonDisabled(true)
    } else {
      setIsSubmitButtonDisabled(false)
    }
  }, [currentLanguage, languageDetails, setIsSubmitButtonDisabled])

  return (
    <section className={styles.Language}>
      {/* Top Bar */}
      <div className={styles.Language__TopBar}>
        <h3>Add Language Support</h3>
        <Button disabled={filteredLanguages.length === 0} onClick={handleAddLanguage} icon={plusSVG}>Add Language</Button>
        {showLanguageSelection && <div className={styles.Language__SelectionPopUp}>
          {filteredLanguages.map((item, index) => (
            <p key={index} onClick={() => addNewLanguage(item)}>{item}</p>
          ))}
        </div>}
      </div>
      {showLanguageSelection && <div className={styles.Language__PopUpOverlay} onClick={() => setShowLanguageSelection(false)} />}

      {/* Empty State */}
      {languageDetails.length === 0 && <div className={styles.Language__EmptyState}>
        <h4>No language added yet</h4>
      </div>}

      {/* Languages Content */}
      {languageDetails.length > 0 && <div className={styles.Language__LanguageItemContainer}>
        <nav className={styles.Language__Navigation}>
          {languageDetails.map((item, index) => (
            <button key={index}
              onClick={() => changeCurrentLanguage(item)}
              className={item.language === currentLanguage.language ? styles['Language__NavigationActive'] : ''}>
              {item.language}
              <span onClick={(e) => removeExistingLanguage(e, item.language)}><CloseIcon /></span>
            </button>
          ))}
        </nav>

        <div className={styles.Language__CodeEditorWrapper}>
          <label>Snippet</label>
          <Editor
            height="400px"
            theme='vs-dark'
            language={currentLanguage.language.toLowerCase()}
            value={currentLanguage.snippet}
            onChange={(value) => handleCodeEditorValueChange('snippet', value as string)} />
        </div>

        <div className={styles.Language__CodeEditorWrapper}>
          <label>Solution</label>
          <Editor
            height="400px"
            theme='vs-dark'
            language={currentLanguage.language.toLowerCase()}
            value={currentLanguage.solution}
            onChange={(value) => handleCodeEditorValueChange('solution', value as string)} />
        </div>
      </div>}
    </section>
  );
}

export default Language;
