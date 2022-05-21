import OmniAural from 'omniaural'
import { faPlayCircle, faSmile } from '@fortawesome/free-regular-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useTranslation } from 'next-i18next'
import { ButtonIcon } from '../Buttons/ButtonIcon'

type Props = {
  aboveSectionNodes: any
  featuresData: any[]
  headerText1: string
  headerText2: string
  headerText: string
  leftAlignedStyle: boolean
  legendAsterisk?: string
}

const keyPrefix = 'comparion_table'

export const ComparisonTable = ({
  aboveSectionNodes,
  featuresData,
  headerText1,
  headerText2,
  headerText,
  leftAlignedStyle,
  legendAsterisk
}: Props) => {
  const { t } = useTranslation()

  const comparisonTableWrapperStyle = classNames(
    'comparison-table-wrapper',
    leftAlignedStyle ? 'left-aligned-style' : ''
  )

  const playVideoInModal = (previewVideoEmbed: Node) => {
    OmniAural.modalsFeatureVideoPreviewShow(previewVideoEmbed)
  }

  const dataElements =
    featuresData &&
    featuresData.map((x: any, index: number) => (
      <div key={`${keyPrefix}_${index}`} role='rowgroup'>
        <div className='comparison-table__row' role='row'>
          <div className='comparison-table-row__text' role='cell'>
            {x.text}
            {x.previewVideoEmbed && (
              <ButtonIcon
                className='play-preview'
                faIcon={faPlayCircle}
                isLink
                onClick={() => playVideoInModal(x.previewVideoEmbed)}
              />
            )}
          </div>
          <div className='comparison-table-row__icon' role='cell'>
            {x.icon1 && <FontAwesomeIcon icon={x.iconType === 'smile' ? faSmile : faCheck} />}
            {x.icon1Asterisk ? '*' : ''}
            <div className='aria-only-visible-to-screen-readers'>
              {x.icon1 ? t('Yes') : t('No')} {x.iconType === 'smile' ? ':)' : ''}
            </div>
          </div>
          <div className='comparison-table-row__icon' role='cell'>
            {x.icon2 && <FontAwesomeIcon icon={x.iconType === 'smile' ? faSmile : faCheck} />}
            {x.icon2Asterisk ? '*' : ''}
            <div className='aria-only-visible-to-screen-readers'>
              {x.icon2 ? t('Yes') : t('No')} {x.iconType === 'smile' ? ':)' : ''}
            </div>
          </div>
        </div>
      </div>
    ))

  return (
    <>
      <div className={comparisonTableWrapperStyle}>
        {aboveSectionNodes && <div className='above-section'>{aboveSectionNodes}</div>}
        <div
          aria-label={t('Below is a comparison of free and premium features')}
          className='aria-only-visible-to-screen-readers'
          tabIndex={0}
        />
        <div className='comparison-table-preview-legend'>{t('Membership preview text legend')}</div>
        <div className='comparison-table' role='table'>
          <div role='rowgroup'>
            <div className='comparison-table__header' role='row'>
              <div className='comparison-table-header__text' role='columnheader'>
                {headerText}
              </div>
              <div className='comparison-table-header__icon' role='columnheader'>
                {headerText1}
              </div>
              <div className='comparison-table-header__icon' role='columnheader'>
                {headerText2}
              </div>
            </div>
          </div>
          {dataElements && dataElements.length > 0 && dataElements}
        </div>
        {legendAsterisk ? <div className='legend-row'>* {legendAsterisk}</div> : null}
      </div>
    </>
  )
}
