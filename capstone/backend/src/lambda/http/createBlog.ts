import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateBlogRequest } from '../../requests/CreateBlogRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { createBlog } from '../../services/blogService'

const logger = createLogger('createBlog controller')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const blogRequest: CreateBlogRequest = JSON.parse(event.body)
  logger.info('create blog request received', blogRequest)

  const newBlog = await createBlog(blogRequest, getUserId(event))
  logger.info('create blog request successful: ', newBlog)


  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newBlog
    })
  }

}
