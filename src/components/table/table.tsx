import type { HTMLAttributes, Ref } from 'react'
import { classnames } from '@/utils/classnames'
import styles from './table.module.css'

type TableProps = HTMLAttributes<HTMLTableElement> & {
  ref?: Ref<HTMLTableElement | null>
  wrapperClassName?: string
}
export function Table(props: Readonly<TableProps>) {
  const { ref, wrapperClassName, ...rest } = props

  return (
    <div className={classnames(styles.wrapper, wrapperClassName)}>
      <table ref={ref} {...rest} />
    </div>
  )
}

type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement> & {
  ref?: Ref<HTMLTableSectionElement | null>
}
export function TableHeader(props: Readonly<TableHeaderProps>) {
  const { ref, className, ...rest } = props

  return (
    <thead
      ref={ref}
      className={classnames(styles.thead, className)}
      {...rest}
    />
  )
}

type TableBodyProps = HTMLAttributes<HTMLTableSectionElement> & {
  ref?: Ref<HTMLTableSectionElement | null>
}
export function TableBody(props: Readonly<TableBodyProps>) {
  const { ref, className, ...rest } = props

  return (
    <tbody
      ref={ref}
      className={classnames(styles.tbody, className)}
      {...rest}
    />
  )
}

type TableRowProps = HTMLAttributes<HTMLTableRowElement> & {
  ref?: Ref<HTMLTableRowElement | null>
}
export function TableRow(props: Readonly<TableRowProps>) {
  const { ref, className, ...rest } = props

  return <tr ref={ref} className={classnames(styles.tr, className)} {...rest} />
}

type TableHeadProps = HTMLAttributes<HTMLTableCellElement> & {
  ref?: Ref<HTMLTableCellElement | null>
}
export function TableHead(props: Readonly<TableHeadProps>) {
  const { ref, className, ...rest } = props

  return <th ref={ref} className={classnames(styles.th, className)} {...rest} />
}

type TableCellProps = HTMLAttributes<HTMLTableCellElement> & {
  ref?: Ref<HTMLTableCellElement | null>
}
export function TableCell(props: Readonly<TableCellProps>) {
  const { ref, className, ...rest } = props

  return <td ref={ref} className={classnames(styles.td, className)} {...rest} />
}
