import * as uuid from 'uuid'

import { postItem } from '../../models/postItem'
import { postsAccess } from '../dataLayer/postsAccess'
import { CreatepostRequest } from '../requests/CreatePostRequest'
import { UpdatepostRequest } from '../requests/UpdatePostRequest'

const postAccess = new postsAccess()

export async function getAllposts(userId: string): Promise<postItem[]> {

  return await postAccess.getAllposts(userId)
}

export async function createpostItem(
  createGroupRequest: CreatepostRequest,
  userId: string
): Promise<postItem> {

  return await postAccess.createpostItem({
    userId,
    postId: uuid.v4(),
    posted: false,
    createdAt: new Date().toISOString(),
    ...createGroupRequest
  })
}

export async function generateUploadUrl(userId: string, postId: string): Promise<string> {
  const uploadUrl = await postAccess.getSignedUrl(postId)
  await postAccess.updateAttachmentUrl(userId, postId)

  return uploadUrl
}

export async function updatepostItem(
  updatepostRequest: UpdatepostRequest,
  userId: string,
  postId: string
): Promise<void> {

  await postAccess.updatepostItem(updatepostRequest, userId, postId)
}

export async function deletepostItem(userId: string, postId: string) {

  await Promise.all([
    postAccess.deletepostItem(userId, postId),
    postAccess.deletepostItemAttachment(postId)
  ])  
}
// export async function updatepostUrl(updatepost, userId: string, postId: string, jwtToken: string): Promise<postItem>{
//     return await postAccess.updatepostUrl({
//         userId,
//         postId,
//         attachmentUrl: updatepost.attachmentUrl,
//         jwtToken:parseUserId(jwtToken)
//     })
// }
