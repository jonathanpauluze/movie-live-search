import { Modal } from '@/components/modal'
import styles from './redirect-modal.module.css'

type RedirectModalProps = {
  isOpen: boolean
  onClose?: VoidFunction
}

export function RedirectModal(props: Readonly<RedirectModalProps>) {
  const { isOpen, onClose } = props

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} title="Redirecionando..." onClose={onClose}>
      <p className={styles.text}>Redirecionando para o site do IMDB...</p>
    </Modal>
  )
}
