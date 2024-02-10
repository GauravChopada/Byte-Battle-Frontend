import { formatTimeInHourMinutes, getChipType } from "@/utils/Helpers/common"
import styles from "./QuestDescription.module.scss"
import { TopicInstance } from "@/app/quests/[questId]/page"
import Chip, { ChipTypes } from "@/components/Chip"

type Props = {
  title: string
  description: string
  constraints: string
  difficulty: string
  appropriateTime: number
  topics: TopicInstance[]
}

const QuestDescription = ({ appropriateTime, description, difficulty, constraints, topics }: Props) => {
  return (
    <section className={styles.QuestDescription}>
      <div className={styles.QuestDescription__Row}>
        <div className={styles.QuestDescription__InfoColumn}>
          <h4>Difficulty</h4>
          <Chip type={getChipType(difficulty)}>{difficulty}</Chip>
        </div>

        <div className={styles.QuestDescription__InfoColumn}>
          <h4>Required Time</h4>
          <Chip type={getChipType(appropriateTime, 'time')}>{formatTimeInHourMinutes(appropriateTime)}</Chip>
        </div>
      </div>

      <div className={styles.QuestDescription__InfoColumn}>
        <h4>Topics</h4>
        <div className={styles.QuestDescription__TopicsWrapper}>
          {topics.map((topic) => (
            <Chip type={ChipTypes.DEFAULT} key={topic.id}>{topic.name}</Chip>
          ))}
        </div>
        {topics.length === 0 && <p>No Topics Added Yet</p>}
      </div>

      <div className={styles.QuestDescription__InfoColumn}>
        <h4>Description</h4>
        {description.split('\n').map((value) => <p key={value}>{value}</p>)}
      </div>

      <div className={styles.QuestDescription__InfoColumn}>
        <h4>Constraints</h4>
        {constraints.split('\n').map((value) => <p key={value}>{value}</p>)}
      </div>
    </section>
  );
}

export default QuestDescription;
