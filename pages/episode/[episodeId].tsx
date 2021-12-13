import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { useOmniAural } from 'omniaural'
import type { Episode, MediaRef, PVComment, SocialInteraction, User } from 'podverse-shared'
import { useEffect, useRef, useState } from 'react'
import {
  ClipListItem,
  ColumnsWrapper,
  Comments,
  EpisodeInfo,
  EpisodePageHeader,
  FundingLink,
  List,
  Meta,
  PageHeader,
  PageScrollableContent,
  Pagination,
  SideContentSection,
  SideContent
} from '~/components'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'
import { calcListPageCount } from '~/lib/utility/misc'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getEpisodeById } from '~/services/episode'
import { getMediaRefsByQuery } from '~/services/mediaRef'
import { getDefaultServerSideProps } from '~/services/serverSideHelpers'
import { getEpisodeProxyActivityPub } from '~/services/socialInteraction/activityPub'
import { getTwitterComments } from '~/services/socialInteraction/twitter'

interface ServerProps extends Page {
  serverClips: MediaRef[]
  serverClipsFilterPage: number
  serverClipsFilterSort: string
  serverClipsPageCount: number
  serverEpisode: Episode
}

type FilterState = {
  clipsFilterPage?: number
  clipsFilterSort?: string
}

const keyPrefix = 'pages_episode'

/* *TODO*
    Rewrite this file to follow the patterns in pages/podcasts and pages/search.
    Move all functions inside the render function,
    get rid of the filterState,
    stop passing in filterState as a parameter,
    and instead get and set the filterState fields individually.
    Keep the sections in the same order
    (Initialization, useEffects, Client-Side Queries, Render Helpers).
*/

export default function Episode({
  serverClips,
  serverClipsPageCount,
  serverEpisode,
  serverClipsFilterPage,
  serverClipsFilterSort
}: ServerProps) {
  /* Initialize */

  const { id } = serverEpisode
  const { t } = useTranslation()
  const [filterState, setFilterState] = useState({
    clipsFilterPage: serverClipsFilterPage,
    clipsFilterSort: serverClipsFilterSort
  } as FilterState)
  const [comment, setComment] = useState<PVComment>(null)
  const [userInfo] = useOmniAural('session.userInfo')
  const { clipsFilterPage, clipsFilterSort } = filterState
  const [clipsListData, setClipsListData] = useState<MediaRef[]>(serverClips)
  const [clipsPageCount, setClipsPageCount] = useState<number>(serverClipsPageCount)
  const initialRender = useRef(true)

  /* useEffects */

  useEffect(() => {
    ;(async () => {
      if (serverEpisode?.socialInteraction?.length) {
        const activityPub = serverEpisode.socialInteraction.find(
          (item: SocialInteraction) => item.platform === PV.SocialInteraction.platformKeys.activitypub
        )
        const twitterComments = serverEpisode.socialInteraction.find(
          (item: SocialInteraction) => item.platform === PV.SocialInteraction.platformKeys.twitter
        )

        if (activityPub?.url) {
          const comment = await getEpisodeProxyActivityPub(serverEpisode.id)
          setComment(comment)
        } else if (twitterComments?.url) {
          const comment = await getTwitterComments(twitterComments.url)
        }
      }

      if (initialRender.current) {
        initialRender.current = false
      } else {
        const { data } = await clientQueryClips(
          { page: clipsFilterPage, episodeId: id, sort: clipsFilterSort },
          filterState
        )
        const [newClipsListData, newClipsListCount] = data
        setClipsListData(newClipsListData)
        setClipsPageCount(calcListPageCount(newClipsListCount))
        scrollToTopOfPageScrollableContent()
      }
    })()
  }, [clipsFilterPage, clipsFilterSort])

  /* Meta Tags */

  let meta = {} as any
  let fundingLinks = []

  if (serverEpisode) {
    const { podcast } = serverEpisode
    const podcastTitle = (podcast && podcast.title) || t('untitledPodcast')
    meta = {
      currentUrl: `${PV.Config.WEB_BASE_URL}${PV.RoutePaths.web.episode}/${serverEpisode.id}`,
      description: serverEpisode.description,
      imageAlt: podcastTitle,
      imageUrl: serverEpisode.imageUrl || (podcast && podcast.shrunkImageUrl) || (podcast && podcast.imageUrl),
      title: `${serverEpisode.title} - ${podcastTitle}`
    }
  }

  if (serverEpisode.funding?.length || serverEpisode.podcast.funding?.length) {
    if (serverEpisode.funding?.length) {
      fundingLinks = fundingLinks.concat(serverEpisode.funding)
    }
    if (serverEpisode.podcast.funding?.length) {
      fundingLinks = fundingLinks.concat(serverEpisode.podcast.funding)
    }
    fundingLinks = fundingLinks.map((link) => {
      return <FundingLink key={link.url} link={link.url} value={link.value}></FundingLink>
    })
  }

  return (
    <>
      <Meta
        description={meta.description}
        ogDescription={meta.description}
        ogImage={meta.imageUrl}
        ogTitle={meta.title}
        ogType='website'
        ogUrl={meta.currentUrl}
        robotsNoIndex={false}
        title={meta.title}
        twitterDescription={meta.description}
        twitterImage={meta.imageUrl}
        twitterImageAlt={meta.imageAlt}
        twitterTitle={meta.title}
      />
      <EpisodePageHeader episode={serverEpisode} />
      <PageScrollableContent>
        <ColumnsWrapper
          mainColumnChildren={
            <>
              <EpisodeInfo episode={serverEpisode} includeMediaItemControls />
              {serverEpisode?.socialInteraction?.length ? <Comments comment={comment} /> : null}
              <PageHeader
                isSubHeader
                noMarginBottom
                sortOnChange={(selectedItems: any[]) => {
                  const selectedItem = selectedItems[0]
                  setFilterState({
                    clipsFilterPage: 1,
                    clipsFilterSort: selectedItem.key
                  })
                }}
                sortOptions={PV.Filters.dropdownOptions.clip.sort}
                sortSelected={clipsFilterSort}
                text={t('Clips')}
              />
              <List>{generateClipListElements(clipsListData, serverEpisode, userInfo)}</List>
              <Pagination
                currentPageIndex={clipsFilterPage}
                handlePageNavigate={(newPage) => {
                  setFilterState({ clipsFilterPage: newPage, clipsFilterSort })
                }}
                handlePageNext={() => {
                  const newPage = clipsFilterPage + 1
                  if (newPage <= clipsPageCount) {
                    setFilterState({
                      clipsFilterPage: newPage,
                      clipsFilterSort
                    })
                  }
                }}
                handlePagePrevious={() => {
                  const newPage = clipsFilterPage - 1
                  if (newPage > 0) {
                    setFilterState({
                      clipsFilterPage: newPage,
                      clipsFilterSort
                    })
                  }
                }}
                pageCount={clipsPageCount}
              />
            </>
          }
          sideColumnChildren={
            <SideContent>
              {fundingLinks.length ? (
                <SideContentSection headerText={t('Support')}>{fundingLinks}</SideContentSection>
              ) : null}
            </SideContent>
          }
        />
      </PageScrollableContent>
    </>
  )
}

/* Client-Side Queries */

type ClientQueryClips = {
  episodeId?: string
  page?: number
  sort?: string
}

const clientQueryClips = async ({ episodeId, page, sort }: ClientQueryClips, filterState: FilterState) => {
  const finalQuery = {
    episodeId,
    ...(page ? { page } : { page: filterState.clipsFilterPage }),
    ...(sort ? { sort } : { sort: filterState.clipsFilterSort })
  }
  return getMediaRefsByQuery(finalQuery)
}

/* Render Helpers */

const generateClipListElements = (listItems: MediaRef[], episode: Episode, userInfo?: User) => {
  return listItems.map((listItem, index) => {
    listItem.episode = episode
    return (
      <ClipListItem
        isLoggedInUserMediaRef={userInfo && userInfo.id === listItem.owner.id}
        mediaRef={listItem}
        podcast={episode.podcast}
        key={`${keyPrefix}-${index}`}
      />
    )
  })
}

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { locale, params } = ctx
  const { episodeId } = params
  
  const [defaultServerProps, episodeResponse] = await Promise.all([
    getDefaultServerSideProps(ctx, locale),
    getEpisodeById(episodeId as string)
  ])

  const serverEpisode = episodeResponse.data

  const serverClipsFilterSort = PV.Filters.sort._topPastYear
  const serverClipsFilterPage = 1

  const clipsResponse = await getMediaRefsByQuery({
    episodeId,
    sort: serverClipsFilterSort
  })
  const [clipsListData, clipsListDataCount] = clipsResponse.data
  const serverClips = clipsListData
  const serverClipsPageCount = calcListPageCount(clipsListDataCount)

  const props: ServerProps = {
    ...defaultServerProps,
    serverClips,
    serverClipsFilterPage,
    serverClipsFilterSort,
    serverClipsPageCount,
    serverEpisode
  }

  return { props }
}
