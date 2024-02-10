import classNames from 'classnames'
import StepperIcon from '../../utils/Icons/Stepper'
import styles from './Stepper.module.scss'

type Props = {
  steps: string[]
  currentStep: number
}

const Stepper = ({ steps, currentStep }: Props) => {
  return (
    <div className={styles.Stepper}>
      {
        steps.map((step, index) => (
          <div key={index} className={styles.Stepper__StepItemContainer}>
            {index > 0 && <div className={classNames(styles.Stepper__StepLine, index <= currentStep ? styles['Stepper__StepLine--Active'] : index === currentStep + 1 ? styles['Stepper__StepLine--NoMarginLeft'] :'')} />}
            <div className={styles.Stepper__StepItem}>
              <span className={classNames(styles.Stepper__StepIndicator, currentStep === index ? styles['Stepper__StepIndicator--Active'] : currentStep > index ? styles['Stepper__StepIndicator--Completed'] : '')}>
                {index < currentStep && <StepperIcon />}
              </span>
              <span className={classNames(styles.Stepper__StepLabel, index === currentStep ? styles['Stepper__StepLabel--Active'] : '')}>{step}</span>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Stepper
