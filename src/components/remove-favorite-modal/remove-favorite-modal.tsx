import { Modal } from '@/components/modal'
import styles from './remove-favorite-modal.module.css'

type RemoveFavoriteModalProps = {
  isOpen: boolean
  movieTitle: string
  onConfirm?: VoidFunction
  onClose?: VoidFunction
}

export function RemoveFavoriteModal(props: Readonly<RemoveFavoriteModalProps>) {
  const { isOpen, movieTitle, onConfirm, onClose } = props

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} title="Remover favorito" onClose={onClose}>
      <p className={styles.text}>
        Tem certeza que deseja remover o filme "<span>{movieTitle}</span>" dos
        seus favoritos?
      </p>

      <div className={styles.buttonsWrapper}>
        <button onClick={onClose}>Cancelar</button>

        <button onClick={onConfirm} className={styles.removeBtn}>
          Remover
        </button>
      </div>
    </Modal>
  )
}
