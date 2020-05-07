import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateBlogRequest } from '../../requests/UpdateBlogRequest'
import { createLogger } from '../../utils/logger'
import { updateBlog } from '../../services/blogService'
import { getUserId } from '../utils'
const logger = createLogger('Updateblog controller')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const blogId = event.pathParameters.blogId
  const updatedBlog: UpdateBlogRequest = JSON.parse(event.body)
  logger.info('update blog request received', updatedBlog)

  const userId = getUserId(event)

  await updateBlog(updatedBlog, blogId, userId)
  console.log('Blog updated successfully: ', blogId)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: null
  }
}
