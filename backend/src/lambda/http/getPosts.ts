import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import {parseUserId } from '../../auth/utils'

const aws = AWSXRay.captureAWS(AWS)

const docClient = new aws.DynamoDB.DocumentClient()

const postsTable = process.env.TODOS_TABLE
const userIdIndex = process.env.USERID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  console.log('Processing event: ', event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]


  const result = await docClient.query({
      TableName : postsTable,
      IndexName : userIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
          ':userId': parseUserId(jwtToken)
      },

      ScanIndexForward: false
  }).promise()

  const items = result.Items

  return {
    statusCode:200,
    headers:{
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items
    })
  }
}