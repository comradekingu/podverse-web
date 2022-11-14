import {
  AddToPlaylistModal,
  CheckoutModal,
  ConfirmDeleteAccountModal,
  FeatureVideoPreviewModal,
  ForgotPasswordModal,
  FundingModal,
  LoginModal,
  LoginToAlertModal,
  MakeClipModal,
  ShareModal,
  SignUpModal,
  V4VBoostSentModal,
  VerifyEmailModal
} from '~/components'
import { MakeClipSuccessModal } from '../MakeClip/MakeClipSuccessModal'

type Props = unknown

export const Modals = (props: Props) => {
  return (
    <>
      <AddToPlaylistModal />
      <CheckoutModal />
      <ConfirmDeleteAccountModal />
      <FeatureVideoPreviewModal />
      <ForgotPasswordModal />
      <FundingModal />
      <LoginModal />
      <LoginToAlertModal />
      <MakeClipModal />
      <MakeClipSuccessModal />
      <ShareModal />
      <SignUpModal />
      <V4VBoostSentModal />
      <VerifyEmailModal />
    </>
  )
}
