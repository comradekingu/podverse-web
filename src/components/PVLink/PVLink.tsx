import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  ariaLabel?: string
  children: any
  className?: string
  href: string
  onClick?: any
  tabIndex?: number
  target?: '_blank' | ''
}

export const PVLink = ({ ariaLabel, children, className, href, onClick, tabIndex, target }: Props) => {
  const router = useRouter()
  const linkClassName = classnames(className ? className : '')

  /* If already on the same page, force the page to reload with onClick + router.replace */
  const isCurrentPage = href === router.pathname
  const finalOnClick = isCurrentPage
    ? () => {
        router.replace(href)
        onClick?.()
      }
    : onClick

  return (
    <Link href={href}>
      <a className={linkClassName} aria-label={ariaLabel} onClick={finalOnClick} tabIndex={tabIndex} target={target}>
        {children}
      </a>
    </Link>
  )
}
