import { formatTimeInHourMinutes, getChipType } from '@/utils/Helpers/common'
import Chip, { ChipTypes } from '../Chip'
import styles from './QuestDetailsCard.module.scss'

type Props = {
  title: string
  difficulty: string
  appropriateTime: number
}

const QuestDetailsCard = ({ title, difficulty, appropriateTime }: Props) => {
  return <section className={styles.QuestDetailsCard}>
    <h1>{title}</h1>
    <div className={styles.QuestDetailsCard__ChipsWrapper}>
      <Chip type={getChipType(difficulty)}>{difficulty}</Chip>
      <Chip type={getChipType(appropriateTime, 'time')}>{formatTimeInHourMinutes(appropriateTime)}</Chip>
    </div>
  </section>
}

export default QuestDetailsCard
