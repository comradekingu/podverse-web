import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import OmniAural from 'omniaural'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import {
  ButtonRectangle,
  ColumnsWrapper,
  Footer,
  Meta,
  PageHeader,
  PageScrollableContent,
  SideContent
} from '~/components'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { downloadMyData } from '~/services/user'

type ServerProps = Page

export default function Settings(props: ServerProps) {
  /* Initialize */

  const { t } = useTranslation()

  /* Meta Tags */

  const meta = {
    currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.settings}`,
    description: t('pages-about_Description'),
    title: t('pages-settings_Title')
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
      <PageHeader text={'Settings'} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <div className='text-page'>
              <h3>{t('Account')}</h3>
              <br />
              <ButtonRectangle label={t('Download my data')} onClick={downloadMyData} type='primary' />
              <div className='button-explanation'>{t('Download my data explanation')}</div>
              <br />
              <hr />
              <br />
              <ButtonRectangle
                isDanger
                label={t('Delete my account')}
                onClick={OmniAural.modalsConfirmDeleteAccountShow}
                type='primary'
              />
            </div>
          }
          sideColumnChildren={<SideContent />}
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

  const serverProps: ServerProps = {
    ...defaultServerProps
  }

  return { props: serverProps }
}
