import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { postItem } from '../../models/PostItem'
import { UpdatepostRequest } from '../requests/UpdatePostRequest'

const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class postsAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly s3 = new AWS.S3({ signatureVersion: 'v4' }),
    private readonly postTable = process.env.TODOS_TABLE,
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION) {
  }

  async getAllposts(userId: string): Promise<postItem[]> {
    const result = await this.docClient.query({
      TableName: this.postTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': userId
        },
    }).promise()

    const items = result.Items
    return items as postItem[]
  }

  async createpostItem(postItem: postItem): Promise<postItem> {
    await this.docClient.put({
      TableName: this.postTable,
      Item: {
        ...postItem
      }
    }).promise()

    return postItem
  }

  async getSignedUrl(bucketKey: string): Promise<string> {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: bucketKey,
      Expires: this.urlExpiration
    })
  }

  async updateAttachmentUrl(userId: string, postId: string): Promise<void> {
    await this.docClient.update({
      TableName: this.postTable,
      Key: {
        "userId": userId,
        "postId": postId
      },
      UpdateExpression: "set attachmentUrl=:attachmentUrl",
      ExpressionAttributeValues:{
          ":attachmentUrl": `https://${this.bucketName}.s3.amazonaws.com/${postId}`
      }
    }).promise()
  }

  async updatepostItem(updatepostRequest: UpdatepostRequest, userId: string, postId: string): Promise<void> {
    await this.docClient.update({
      TableName: this.postTable,
      Key: {
        "userId": userId,
        "postId": postId
      },
      UpdateExpression: "set #name=:name, postDate=:postDate, posted=:posted",
      ExpressionAttributeValues:{
          ":name": updatepostRequest.name,
          ":postDate": updatepostRequest.postDate,
          ":posted": updatepostRequest.posted
      },
      ExpressionAttributeNames: {
        "#name": "name"
      }
    }).promise()
  }

  async deletepostItem(userId: string, postId: string): Promise<void> {
    await this.docClient.delete({
      TableName: this.postTable,
      Key: {
        "userId": userId,
        "postId": postId
      }
    }).promise()
  }

  async deletepostItemAttachment(bucketKey: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.bucketName,
      Key: bucketKey
    }).promise()
  }
//   async updatepostUrl(updatedpost: any): Promise<postItem> {
//     await this.docClient.update({
//         TableName: this.postTable,
//         Key: { 
//             postId: updatedpost.postId, 
//             userId: updatedpost.userId },
//         ExpressionAttributeNames: {"#A": "attachmentUrl"},
//         UpdateExpression: "set #A = :attachmentUrl",
//         ExpressionAttributeValues: {
//             ":attachmentUrl": updatedpost.attachmentUrl,
//         },
//         ReturnValues: "UPDATED_NEW"
//     }).promise()
      
//     return updatedpost
    
// }
}
