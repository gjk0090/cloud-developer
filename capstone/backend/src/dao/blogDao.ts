import { BlogItem } from "../models/BlogItem"
import { createLogger } from "../utils/logger"
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { BlogUpdate } from "../models/BlogUpdate"
const logger = createLogger('blog dao')

const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient()
const blogsTable = process.env.BLOGS_TABLE
const userIdIndex = process.env.USER_ID_INDEX

export async function createBlog(blogItem: BlogItem): Promise<BlogItem> {

    logger.info('in createBlog dao')

    await docClient.put({
      TableName: blogsTable,
      Item: blogItem
    }).promise()

    logger.info('create blog successful')
    return blogItem
}


export async function getAllBlogs(userId: string): Promise<BlogItem[]> {
    logger.info('getting all blogs for user with ID: ', userId)
    const result = await docClient.query({
        TableName: blogsTable,
        IndexName: userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()
    logger.info('fecthed blogs: ', result);

    const items = result.Items
    logger.info('blogs access items ', items)
    return items as BlogItem[]
}

export async function updateBlog(blogItem: BlogUpdate, blogId: string, userId: string): Promise<BlogUpdate>{
    logger.info('updating blog item with Id: ', blogId)

    await docClient.update({
        TableName: blogsTable,
        Key: {
            userId,
            blogId
        },
        UpdateExpression: "set title = :title, content = :content",
        ExpressionAttributeValues: {
            ":title": blogItem.title,
            ":content": blogItem.content
        }
    }).promise()

    logger.info('item updated successfully')  
    return blogItem
}

export async function deleteBlog(blogId: string, userId: string): Promise<any> {
    logger.info('deleting blog item with Id: ', blogId)
    await docClient.delete({
        TableName: blogsTable,
        Key: {
          userId,
          blogId
        }
      }).promise()

    logger.info('item deleted successfully')
  return null;
}