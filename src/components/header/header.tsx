import { ThemeToggle } from '@/components/theme-toggler'
import styles from './header.module.css'

export function Header() {
  return (
    <header className={styles.wrapper}>
      <div className={styles.container}>
        <p className={styles.logo}>PlanneMovie DB</p>

        <ThemeToggle />
      </div>
    </header>
  )
}
