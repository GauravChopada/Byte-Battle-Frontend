import type { ReactNode } from "react"

import styles from './Modal.module.scss'

type Props = {
  children: ReactNode
  open?: boolean
  onClose: () => void
}

const Modal = ({ children, open = false, onClose }: Props) => {

  const handleOverlayClick = () => {
    onClose()
  }

  if (!open) {
    return <></>
  }

  return (
    <>
      <div className={styles.Modal}>
        {children}
      </div>
      <div className={styles.Modal__Overlay} onClick={handleOverlayClick} />
    </>
  )
}

export default Modal
