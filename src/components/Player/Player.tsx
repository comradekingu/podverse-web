import { useOmniAural } from 'omniaural'
import classnames from 'classnames'
import { PlayerFullView } from './PlayerFullView'
import { PlayerItemInfo } from './PlayerItemInfo'
import { PlayerItemButtons } from './PlayerItemOptions'
import { PlayerItemProgress } from './PlayerItemProgress'

type Props = unknown

export const Player = (props: Props) => {
  const [player] = useOmniAural('player')

  const mainPlayerStyle = classnames('player', player.show ? '' : 'display-none')

  if (!player?.currentNowPlayingItem) {
    return null
  }

  return (
    <>
      <div className={mainPlayerStyle}>
        <PlayerItemInfo nowPlayingItem={player.currentNowPlayingItem} />
        <PlayerItemProgress />
        <PlayerItemButtons />
      </div>
      <PlayerFullView nowPlayingItem={player.currentNowPlayingItem} />
    </>
  )
}
