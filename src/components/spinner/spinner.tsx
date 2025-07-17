import styles from './spinner.module.css'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
}

export function Spinner(props: Readonly<SpinnerProps>) {
  const { size = 'md' } = props

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.spinner} data-size={size}></div>
    </div>
  )
}
