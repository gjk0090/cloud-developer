import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader,
  Form,
  TextArea,
  Segment
} from 'semantic-ui-react'

import { createBlog, deleteBlog, getBlogs, patchBlog } from '../api/blogs-api'
import Auth from '../auth/Auth'
import { Blog } from '../types/Blog'

interface BlogsProps {
  auth: Auth
  history: History
}

interface BlogsState {
  blogs: Blog[]
  title: string
  content: string
  loadingBlogs: boolean
}

export class Blogs extends React.PureComponent<BlogsProps, BlogsState> {
  state: BlogsState = {
    blogs: [],
    title: '',
    content: '',
    loadingBlogs: true
  }

  handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ title: event.target.value })
  }
  handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ content: event.target.value })
  }

  onEditButtonClick = (blogId: string) => {
    this.props.history.push(`/blogs/${blogId}/edit`)
  }


  onBlogCreate = async (event: React.SyntheticEvent) => {
    try {
      const newBlog = await createBlog(this.props.auth.getIdToken(), {
        title: this.state.title,
        content: this.state.content
      })
      this.setState({
        blogs: [...this.state.blogs, newBlog],
        title: '',
        content: ''
      })
    } catch {
      alert('Blog creation failed')
    }
  }

  onBlogDelete = async (blogId: string) => {
    try {
      await deleteBlog(this.props.auth.getIdToken(), blogId)
      this.setState({
        blogs: this.state.blogs.filter(blog => blog.blogId != blogId)
      })
    } catch {
      alert('Blog deletion failed')
    }
  }


  async componentDidMount() {
    try {
      const blogs = await getBlogs(this.props.auth.getIdToken())
      this.setState({
        blogs,
        loadingBlogs: false
      })
    } catch (e) {
      alert(`Failed to fetch blogs: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Blogs</Header>

        {this.renderCreateBlogInput()}

        {this.renderBlogs()}
      </div>
    )
  }

  renderCreateBlogInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Form onSubmit={this.onBlogCreate}>
            <Form.Field onChange={this.handleTitleChange}>
              <label>Title</label>
              <input/>
            </Form.Field>
            <Form.Field onChange={this.handleContentChange} control={TextArea} label='Content'/>
            <Button type='submit'>Submit</Button>
          </Form>
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderBlogs() {
    if (this.state.loadingBlogs) {
      return this.renderLoading()
    }

    return this.renderBlogsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Blogs
        </Loader>
      </Grid.Row>
    )
  }

  renderBlogsList() {
    return (
      <Grid padded>
        {this.state.blogs.map((blog, pos) => {
          return (
            <Grid.Row key={blog.blogId}>
              <Grid.Column width={11} verticalAlign="middle">
                <Segment raised>
                  <h2>{blog.title}</h2>
                  {blog.createdAt}
                  <br/>
                  <p>
                    <Button
                      icon
                      color="blue"
                      onClick={() => this.onEditButtonClick(blog.blogId)}
                    >
                      <Icon name="pencil" />
                    </Button>
                    <Button
                      icon
                      color="red"
                      onClick={() => this.onBlogDelete(blog.blogId)}
                    >
                      <Icon name="delete" />
                    </Button>
                  </p>
                  <p>
                    {blog.content}
                  </p>
                  <p>
                    {blog.attachmentUrl && (
                      <Image src={blog.attachmentUrl} size="small" wrapped />
                    )}
                  </p>
                  <Divider />
                </Segment>
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }


}
