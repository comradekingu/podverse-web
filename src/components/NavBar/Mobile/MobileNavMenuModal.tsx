import { useRouter } from 'next/router'
import { useOmniAural } from 'omniaural'
import { useTranslation } from 'react-i18next'
import Modal from 'react-modal'
import { ButtonClose } from '~/components'
import { eventNavBarLinkClicked } from '~/lib/utility/events'
import { PV } from '~/resources'
import { OmniAuralState } from '~/state/omniauralState'
import { MobileNavMenuLink } from './MobileNavMenuLink'

type Props = {
  handleHideMenu: any
  show: boolean
}

export const MobileNavMenuModal = ({ handleHideMenu, show }: Props) => {
  const router = useRouter()
  const { t } = useTranslation()
  const [userInfo] = useOmniAural('session.userInfo') as [OmniAuralState['session']['userInfo']]

  return (
    <Modal
      className='mobile-nav-menu-modal'
      contentLabel={t('Navigation menu')}
      isOpen={show}
      onRequestClose={handleHideMenu}
      overlayClassName='mobile-nav-menu-modal-overlay'
    >
      <ButtonClose onClick={handleHideMenu} />
      <div className='scrollable-content'>
        <MobileNavMenuLink
          active={router.pathname == PV.RoutePaths.web.podcasts || router.pathname == PV.RoutePaths.web.home}
          handleHideMenu={handleHideMenu}
          href={PV.RoutePaths.web.podcasts}
          onClick={() => eventNavBarLinkClicked('podcasts')}
          text={t('Podcasts')}
        />
        <MobileNavMenuLink
          active={router.pathname == PV.RoutePaths.web.episodes}
          handleHideMenu={handleHideMenu}
          href={PV.RoutePaths.web.episodes}
          onClick={() => eventNavBarLinkClicked('episodes')}
          text={t('Episodes')}
        />
        <MobileNavMenuLink
          active={router.pathname == PV.RoutePaths.web.clips}
          handleHideMenu={handleHideMenu}
          href={PV.RoutePaths.web.clips}
          onClick={() => eventNavBarLinkClicked('clips')}
          text={t('Clips')}
        />
        <MobileNavMenuLink
          active={router.pathname == PV.RoutePaths.web.livestreams}
          handleHideMenu={handleHideMenu}
          href={PV.RoutePaths.web.livestreams}
          text={t('Livestreams')}
        />
        <hr />
        <div className='mobile-nav-menu-section-header'>{t('MyLibrary')}</div>
        <MobileNavMenuLink
          active={router.pathname == PV.RoutePaths.web.queue}
          handleHideMenu={handleHideMenu}
          href={PV.RoutePaths.web.queue}
          text={t('Queue')}
        />
        <MobileNavMenuLink
          active={router.pathname == PV.RoutePaths.web.history}
          handleHideMenu={handleHideMenu}
          href={PV.RoutePaths.web.history}
          text={t('History')}
        />
        <MobileNavMenuLink
          active={
            userInfo
              ? router.asPath == `${PV.RoutePaths.web.profile}/${userInfo.id}`
              : router.pathname == PV.RoutePaths.web.my_profile
          }
          handleHideMenu={handleHideMenu}
          href={userInfo ? `${PV.RoutePaths.web.profile}/${userInfo.id}` : PV.RoutePaths.web.my_profile}
          text={t('MyProfile')}
        />
        <MobileNavMenuLink
          active={userInfo && router.asPath == `${PV.RoutePaths.web.profile}/${userInfo.id}?type=clips`}
          handleHideMenu={handleHideMenu}
          href={userInfo ? `${PV.RoutePaths.web.profile}/${userInfo.id}?type=clips` : `${PV.RoutePaths.web.my_profile}`}
          text={t('MyClips')}
        />
        <MobileNavMenuLink
          active={router.pathname == PV.RoutePaths.web.playlists}
          handleHideMenu={handleHideMenu}
          href={PV.RoutePaths.web.playlists}
          text={t('Playlists')}
        />
        <MobileNavMenuLink
          active={router.pathname == PV.RoutePaths.web.profiles}
          handleHideMenu={handleHideMenu}
          href={PV.RoutePaths.web.profiles}
          text={t('Profiles')}
        />
      </div>
    </Modal>
  )
}
