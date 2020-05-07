import { CreateBlogRequest } from "../requests/CreateBlogRequest"
import { BlogItem } from "../models/BlogItem"
import * as uuid from 'uuid'
import { createLogger } from "../utils/logger"
import * as dao from '../dao/blogDao'
import { UpdateBlogRequest } from "../requests/UpdateBlogRequest"
import { BlogUpdate } from "../models/BlogUpdate"

const logger = createLogger('blog service')

const blogBucket = process.env.ATTACHMENT_S3_BUCKET

export async function createBlog(createBlogRequest: CreateBlogRequest, userId: string): Promise<BlogItem> {
    logger.info('in createBlog service')
  
    const blogId = uuid.v4()
  
    return await dao.createBlog({
      userId: userId,
      blogId: blogId,
      createdAt: new Date().toISOString(),
      title: createBlogRequest.title,
      content: createBlogRequest.content,
      attachmentUrl: `https://${blogBucket}.s3.amazonaws.com/${blogId}`
    })
}

export async function getAllBlogs(userId: string): Promise<BlogItem[]> {
    logger.info('in getAllBlogs service')
    return await dao.getAllBlogs(userId)
 }

 export async function updateBlog(updateBlogRequest: UpdateBlogRequest, blogId: string, userId: string): Promise<BlogUpdate> {
    logger.info('in updateBlog service')
    return await dao.updateBlog(updateBlogRequest, blogId, userId)
  }

  export async function deleteBlog(blogId: string, userId: string): Promise<any> {
    logger.info('in deleteBlog service')
    return await dao.deleteBlog(blogId, userId)
  }