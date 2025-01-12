import classnames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

type Props = {
  children: any
  className?: string
  href: string
  onClick?: any
}

export const PVLink = ({ children, className, href, onClick }: Props) => {
  const router = useRouter()
  const linkClassName = classnames(className ? className : '')

  /* If already on the same page, force the page to reload with onClick + router.replace */
  const isCurrentPage = href === router.pathname
  const finalOnClick = isCurrentPage
    ? () => {
        router.replace(href)
      }
    : onClick

  return (
    <Link href={href}>
      <a className={linkClassName} onClick={finalOnClick}>
        {children}
      </a>
    </Link>
  )
}
