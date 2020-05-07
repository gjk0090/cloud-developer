import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { deleteBlog } from '../../services/blogService'
const logger = createLogger('deleteBlog controller')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const blogId = event.pathParameters.blogId
  logger.info('delete blog request received', {"blogId" : blogId})

  const userId = getUserId(event);

  await deleteBlog(blogId, userId)
  logger.info('delete blog request successful', {"blogId" : blogId})

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      blogId
    })
  }
}
