import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdatepostRequest } from '../../requests/UpdatePostRequest'
import * as AWS from 'aws-sdk'
import {parseUserId } from '../../auth/utils'
import * as AWSXRay from 'aws-xray-sdk'

const aws = AWSXRay.captureAWS(AWS)

const docClient = new aws.DynamoDB.DocumentClient()
const postsTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Caller event", event)
  const postId = event.pathParameters.postId
 
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

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const oldpostId = await retrieveOld(postId)
 

  const updatedpost: UpdatepostRequest = JSON.parse(event.body)

  const updatedItem = {
    postId: postId,
    userId: parseUserId(jwtToken),
    createdAt: oldpostId.createdAt,
    attachmentUrl: oldpostId.attachmentUrl,
    ...updatedpost
  }


  await docClient.put({
    TableName: postsTable,
    Item: updatedItem
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      updatedItem
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
    return !!result.Item
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