import { Icon } from '@/components/icon'
import { useTheme } from '@/hooks/use-theme'
import styles from './theme-toggler.module.css'
import { classnames } from '@/utils/classnames'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const isDark = theme === 'dark'

  return (
    <label className={styles.switch}>
      <input
        type="checkbox"
        checked={isDark}
        onChange={toggleTheme}
        className={styles.input}
      />

      <span className={styles.slider}>
        <span className={classnames(styles.icon, styles.iconLeft)}>
          <Icon name="sun" size="sm" />
        </span>
        <span className={classnames(styles.icon, styles.iconRight)}>
          <Icon name="moon" size="sm" />
        </span>
        <span className={styles.thumb}></span>
      </span>
    </label>
  )
}
