import { useEffect, useState } from 'react'

import { questDifficultyLevels, questTimeFormats } from '@/utils/constants/common'
import Input, { InputTypes } from '@/components/Input'
import Radio from '@/components/Radio'
import Select from '@/components/Select'
import styles from './QuestDescription.module.scss'

interface QuestDescription {
  title: string
  description: string
  constraints: string
  difficulty: string
  timeLimit: number
  timeLimitFormat: string
  topics: string[]
}

type Props = {
  data: QuestDescription
  setData: (data: any) => void
  setIsSubmitButtonDisabled: (value: boolean) => void
}

const QuestDescription = ({ data, setData, setIsSubmitButtonDisabled }: Props) => {
  // init
  const topics = [ 'stack', 'array', 'tree', 'graph', 'queue'];
  const initialErrorState = {
    title: '',
    description: '',
    constraints: '',
    difficulty: '',
    timeLimit: '',
    topics: ''
  }
  const [errorState, setErrorState] = useState(initialErrorState)

  const onInputChange = (key: string, value: string | string[]) => {
    if (value) {
      setErrorState({ ...errorState, [key]: '' })
    }
    setData({ ...data, [key]: value })
  }

  const onFocusLost = (key: string, value: string | string[]) => {
    if (!value) {
      setErrorState({ ...errorState, [key]: 'This field is required' })
      return
    }
  }

  // disable submit button if any error is present or any field is empty
  useEffect(() => {
    const hasError = Object.values(errorState).some(item => Boolean(item))
    const hasEmptyField = Object.values(data).some(item => !Boolean(item))
    const isAtLeastOneTopicSelected = data.topics.length > 0

    setIsSubmitButtonDisabled(hasError || hasEmptyField || !isAtLeastOneTopicSelected)
  }, [data, errorState, setIsSubmitButtonDisabled])

  return (
    <section className={styles.QuestDescription}>
      <Input
        label='Title*'
        value={data.title}
        onChange={(newValue) => onInputChange('title', newValue)}
        onFocusLost={(newValue) => onFocusLost('title', newValue)}
        isError={Boolean(errorState?.title)}
        helperText={errorState?.title} />

      <Input
        isTextArea
        label='Description*'
        value={data.description}
        onChange={(newValue) => onInputChange('description', newValue)}
        onFocusLost={(newValue) => onFocusLost('description', newValue)}
        isError={Boolean(errorState?.description)}
        helperText={errorState?.description} />

      <Input
        isTextArea
        label='Constraints*'
        value={data.constraints}
        onChange={(newValue) => onInputChange('constraints', newValue)}
        onFocusLost={(newValue) => onFocusLost('constraints', newValue)}
        isError={Boolean(errorState?.constraints)}
        helperText={errorState?.constraints} />

      <Radio
        label='Difficulty Level'
        options={questDifficultyLevels}
        value={data.difficulty}
        onChange={(newValue) => onInputChange('difficulty', newValue)} />

      <div className={styles.QuestDescription__TimeWrapper}>
        <span>Approx Time Required to complete the Quest</span>
        <Input type={InputTypes.NUMBER} value={data.timeLimit} onChange={(newValue) => onInputChange('timeLimit', newValue)} />
        <Select value={data.timeLimitFormat} options={questTimeFormats} onSelect={(newValue) => onInputChange('timeLimitFormat', newValue)} />
      </div>

      <Input
        label='Topics*'
        selectedOptions={data.topics}
        options={topics}
        onChange={(newValues) => onInputChange('topics', newValues)}
        isError={Boolean(errorState?.topics)}
        helperText={errorState?.topics} />
    </section>
  )
}

export default QuestDescription
