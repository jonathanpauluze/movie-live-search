import styles from './redirect-modal.module.css'

type RedirectModalProps = {
  isOpen: boolean
}

export function RedirectModal(props: Readonly<RedirectModalProps>) {
  const { isOpen } = props

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p>Redirecionando para o IMDB...</p>
      </div>
    </div>
  )
}
