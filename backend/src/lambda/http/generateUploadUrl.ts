import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import {parseUserId } from '../../auth/utils'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const postsTable = process.env.TODOS_TABLE
const attachmentTable = process.env.ATTACHMENTS_TABLE
const bucketName = process.env.ATTACHMENTS_S3_BUCKET


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event: ', event)
  const postId = event.pathParameters.postId
  console.log("postId ", postId)
  const validpostId = await postExists(postId)

  if (!validpostId){
    return{
      statusCode:404,
      headers:{
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'post does not exist'
      })
    }
  }
  const oldpostId = await retrieveOld(postId)
  const attachmentId = uuid.v4()

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await createAttachment(postId, attachmentId, event, jwtToken, oldpostId)


  const url = getUploadUrl(attachmentId)
  // post: Return a presigned URL to upload a file for a post item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    // body: ''
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
}

async function postExists(postId: string){
  const result = await docClient
    .get({
      TableName: postsTable,
      Key:{
        postId: postId
      }
    })
    .promise()

    console.log('Get post: ', result)
    return !!result.Item
}

async function createAttachment(postId: string, attachmentId: string, event: any, jwtToken: string, oldpostId:any) {
  const timestamp = new Date().toISOString()
  const newAttach = JSON.parse(event.body)

  const newItem = {
    postId,
    timestamp,
    attachmentId,
    userId: parseUserId(jwtToken),
    ...newAttach,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${attachmentId}`

  }
  console.log('Storing new item: ', newItem)
  //this is backend where we can store the new url
  await docClient
    .put({
      TableName: attachmentTable,
      Item: newItem
    })
    .promise()

  const updatedItem = {
    postId: postId,
    userId: parseUserId(jwtToken),
    createdAt: oldpostId.createdAt,
    name: oldpostId.name,
    postDate:oldpostId.postDate,
    posted: oldpostId.posted,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${attachmentId}`
  }

  console.log("updateditem is ", updatedItem)

  await docClient.put({
    TableName: postsTable,
    Item: updatedItem
  }).promise()
  console.log("upload completed!")

  return newItem
}

function getUploadUrl(attachmentId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: 300
  })
}

async function retrieveOld(postId: string){
  const result = await docClient.get({
    TableName: postsTable,
    Key:{
      postId: postId
    }
  }).promise()

  return result.Item
}