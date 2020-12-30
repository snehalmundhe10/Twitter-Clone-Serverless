import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import {parseUserId } from '../../auth/utils'
import * as AWSXRay from 'aws-xray-sdk'

const aws = AWSXRay.captureAWS(AWS)

const docClient = new aws.DynamoDB.DocumentClient()
const postsTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const validpostId = await postExists(postId)
  if (!validpostId){
    return{
      statusCode:404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        error: 'post does not exist'
      })
    }
  }

  
  
  var params = {
    TableName: postsTable,
    userId: parseUserId(jwtToken),
    Key: {
      postId: postId
    }
  }
  console.log("params", params)
  
  docClient.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2))
    } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2))
    }
  })

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body:'Item deleted'
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
