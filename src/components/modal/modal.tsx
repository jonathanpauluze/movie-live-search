import { useRef, type ReactNode } from 'react'
import { Icon } from '@/components/icon'
import styles from './modal.module.css'
import { useClickOutside } from '@/hooks/use-click-outside'
import { classnames } from '@/utils/classnames'

type ModalProps = {
  children: ReactNode
  isOpen: boolean
  title: ReactNode
  onClose?: VoidFunction
}

export function Modal(props: Readonly<ModalProps>) {
  const { children, isOpen, title, onClose } = props

  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => {
    onClose?.()
  })

  if (!isOpen) return null

  return (
    <div className={styles.overlay}>
      <div ref={ref} className={classnames(styles.modalBase)}>
        <button
          onClick={onClose}
          className={styles.closeBtn}
          aria-label="Fechar"
        >
          <Icon name="x" />
        </button>

        {title ? <header className={styles.title}>{title}</header> : null}

        {children}
      </div>
    </div>
  )
}
