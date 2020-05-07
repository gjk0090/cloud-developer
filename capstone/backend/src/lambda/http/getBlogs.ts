import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getAllBlogs } from '../../services/blogService'
import { getUserId } from '../utils'
const logger = createLogger('getBlog controller')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('get blog request received')


  const userId = getUserId(event);

  const items = await getAllBlogs(userId)
  console.log('get blog request successful', userId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items
    })
  }
}
