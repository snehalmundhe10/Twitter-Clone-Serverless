import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreatepostRequest } from '../../requests/CreatePostRequest'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import {parseUserId } from '../../auth/utils'
import * as AWSXRay from 'aws-xray-sdk'

const aws = AWSXRay.captureAWS(AWS)

const docClient = new aws.DynamoDB.DocumentClient()
const postsTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)
  const itemId = uuid.v4()

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newpost: CreatepostRequest = JSON.parse(event.body)

  const newItem = {
    postId: itemId,
    userId: parseUserId(jwtToken),
    ...newpost
  }

  await docClient.put({
    TableName: postsTable,
    Item: newItem
  }).promise()

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}