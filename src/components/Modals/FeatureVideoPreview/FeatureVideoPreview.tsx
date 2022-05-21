import { useTranslation } from 'next-i18next'
import OmniAural, { useOmniAural } from 'omniaural'
import Modal from 'react-modal'
import { ButtonClose } from '~/components'
import { OmniAuralState } from '~/state/omniauralState'

type Props = unknown

export const FeatureVideoPreviewModal = (props: Props) => {
  const [featureVideoPreview] = useOmniAural('modals.featureVideoPreview') as [
    OmniAuralState['modals']['featureVideoPreview']
  ]
  const { videoEmbedData } = featureVideoPreview
  const { t } = useTranslation()

  /* Function Helpers */

  const _onRequestClose = () => {
    OmniAural.modalsHideAll()
  }

  return (
    <Modal className='feature-video-preview-modal centered' isOpen={!!videoEmbedData} onRequestClose={_onRequestClose}>
      <h2>{t('Feature Demo')}</h2>
      <ButtonClose onClick={_onRequestClose} />
      {!!videoEmbedData && (
        <iframe
          title={videoEmbedData.title}
          width={videoEmbedData.width}
          height={videoEmbedData.height}
          src={`${videoEmbedData.src}?autoplay=1`}
          frameBorder='0'
          allowFullScreen
          sandbox='allow-same-origin allow-scripts allow-popups'
        />
      )}
    </Modal>
  )
}
