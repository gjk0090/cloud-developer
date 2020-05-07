import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

import * as AWS from "aws-sdk"
const logger = createLogger('signed url controller')

const awsS3 = new AWS.S3({
  signatureVersion: 'v4'
})
const blogBucket = process.env.ATTACHMENT_S3_BUCKET
const signedUrlExpires = 300

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const blogId = event.pathParameters.blogId

  const signedUrl = awsS3.getSignedUrl("putObject", {
    Bucket: blogBucket,
    Key: blogId,
    Expires: signedUrlExpires
  });
  logger.info('singed URL generated: ', {"signedUrl" : signedUrl});
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      uploadUrl: signedUrl
    })
  }
}
