import { useOmniAural } from 'omniaural'

export const V4VHiddenElement = () => {
  const [player] = useOmniAural('player')
  const { currentNowPlayingItem, paused, playbackPosition } = player

  if (!currentNowPlayingItem) {
    return null
  }

  return (
    <div
      className='v4v-hidden-element'
      {...(paused ? {} : { 'data-v4v-is-playing': true })}
      data-v4v-current-playback-position={playbackPosition}
      data-v4v-episode-enclosure-url={currentNowPlayingItem.episodeMediaUrl}
      data-v4v-podcast-index-id={currentNowPlayingItem.podcastIndexPodcastId}
    />
  )
}
