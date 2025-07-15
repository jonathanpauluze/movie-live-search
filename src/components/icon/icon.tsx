import { icons } from './icon-map'
import { classnames } from '@/utils/classnames'

export type IconName = keyof typeof icons
type IconSize = 'sm' | 'md' | 'lg'

const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32
}

type IconProps = {
  name: IconName
  size?: IconSize
  className?: string
}

export const Icon = ({ name, size = 'md', className }: IconProps) => {
  const Component = icons[name]
  const dimension = sizeMap[size]

  if (!Component) return null

  return (
    <Component
      width={dimension}
      height={dimension}
      className={classnames('icon', className)}
    />
  )
}
