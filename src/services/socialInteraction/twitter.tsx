import { PV } from "~/resources"
import { request } from "../request"

export const getTwitterComments = async (tweetUrl: string) => {
  const response = await request({
    url: tweetUrl,
    method: 'get'
  })
  console.log('response', response)
  // const { replies, rootComment } = response.data
  // const comment = convertActivityPubNoteToPVComment(rootComment)
  // comment.isRoot = true
  // const replyComments = convertActivityPubCollectionPageToPVComments(replies)
  // comment.replies = replyComments
  // return comment
}
