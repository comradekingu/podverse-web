import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural from 'omniaural'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { Footer, MessageWithAction, Meta, PageHeader, PageScrollableContent } from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'

type ServerProps = Page

export default function MyProfile(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.my_profile}`,
    description: t('pages-about_Description'),
    title: t('pages-my_profile_Title')
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={false}
        title={meta.title}
        twitterDescription={meta.description}
        twitterTitle={meta.title}
      />
      <PageHeader text={t('MyProfile')} />
      <PageScrollableContent>
        <MessageWithAction
          actionLabel={t('Login')}
          actionOnClick={() => OmniAural.modalsLoginShow()}
          message={t('LoginToViewYourProfile')}
        />
        <Footer />
      </PageScrollableContent>
    </>
  )
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale } = ctx

  const defaultServerProps = await getDefaultServerSideProps(ctx, locale)
  const { serverUserInfo } = defaultServerProps

  if (serverUserInfo) {
    return {
      redirect: {
        destination: `${PV.RoutePaths.web.profile}/${serverUserInfo.id}`,
        permanent: false
      }
    }
  }

  const serverProps: ServerProps = {
    ...defaultServerProps
  }

  return { props: serverProps }
}
