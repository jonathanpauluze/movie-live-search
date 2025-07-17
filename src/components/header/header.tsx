import styles from './header.module.css'

export function Header() {
  return (
    <header className={styles.wrapper}>
      <div>
        <p className={styles.logo}>PlanneMovie DB</p>
      </div>
    </header>
  )
}
