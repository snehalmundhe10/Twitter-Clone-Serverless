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
  Loader
} from 'semantic-ui-react'

import { createPost, deletePost, getPosts, patchPost } from '../api/posts-api'
import Auth from '../auth/Auth'
import { Post } from '../types/Post'

interface PostsProps {
  auth: Auth
  history: History
}

interface PostsState {
  Posts: Post[]
  newPostName: string
  loadingPosts: boolean
}

export class Posts extends React.PureComponent<PostsProps, PostsState> {
  state: PostsState = {
    Posts: [],
    newPostName: '',
    loadingPosts: true
  }

  handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newPostName: event.target.value })
  }

  onEditButtonClick = (postId: string) => {
    this.props.history.push(`/posts/${postId}/edit`)
  }

  onPostCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    try {
      const postDate = this.calculatepostDate()
      const createdDate = this.getcreatedDate()
      const postedPost = false
      const attachmentUrl = " "
      const newPost = await createPost(this.props.auth.getIdToken(), {
        name: this.state.newPostName,
        postDate: postDate,
        createdAt: createdDate,
        posted: postedPost,
        attachmentUrl: attachmentUrl
      })

      

      this.setState({
        Posts: [...this.state.Posts, newPost],
        newPostName: ''
      })
      alert('Tweet creation success')
    } catch {
      alert('Tweet creation failed, please enter more tha two characters')
    }
  }

  // onPostCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
  //   try {
  //     const postDate = this.calculatepostDate()
  //     const newPost = await createPost(this.props.auth.getIdToken(), {
  //       name: this.state.newPostName,
  //       postDate
  //     })
  //     this.setState({
  //       Posts: [...this.state.Posts, newPost],
  //       newPostName: ''
  //     })
  //   } catch {
  //     alert('Post creation failed')
  //   }
  // }


  onPostDelete = async (postId: string) => {
    try {
      await deletePost(this.props.auth.getIdToken(), postId)
      this.setState({
        Posts: this.state.Posts.filter(Post => Post.postId != postId)
      })
      alert('Tweet deletion success')
    } catch {
      alert('Tweet deletion failed')
    }
  }

  onPostCheck = async (pos: number) => {
    try {
      const Post = this.state.Posts[pos]
      await patchPost(this.props.auth.getIdToken(), Post.postId, {
        name: Post.name,
        postDate: Post.postDate,
        posted: !Post.posted
      })
      this.setState({
        Posts: update(this.state.Posts, {
          [pos]: { posted: { $set: !Post.posted } }
        })
      })
    } catch {
      alert('Tweet edit failed')
    }
  }

  async componentDidMount() {
    try {
      const Posts = await getPosts(this.props.auth.getIdToken())
      
      this.setState({
        Posts,
        loadingPosts: false
      })
      // alert('Attachment update success')
    } catch (e) {
      alert(`Failed to fetch Posts: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Posts</Header>

        {this.renderCreatePostInput()}

        {this.renderPosts()}
      </div>
    )
  }

  renderCreatePostInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            action={{
              color: 'twitter',
              labelPosition: 'left',
              icon: 'add',
              content: 'Add Tweet',
              onClick: this.onPostCreate
            }}
            fluid
            actionPosition="left"
            placeholder="Write Tweet"
            onChange={this.handleNameChange}
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderPosts() {
    if (this.state.loadingPosts) {
      return this.renderLoading()
    }

    return this.renderPostsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Posts
        </Loader>
      </Grid.Row>
    )
  }

  renderPostsList() {
    return (
      <Grid padded style={{width: '1300px', height: '150px'}}>
        {this.state.Posts.map((Post, pos) => {
          return (
            <Grid.Row key={Post.postId} style={{backgroundColor: 'whitesmoke', 
            marginRight:'450px'}}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onPostCheck(pos)}
                  checked={Post.posted}
                />
              </Grid.Column>
              <Grid.Column width={8} verticalAlign="middle" style={{color: 'black'}}>
                {Post.name}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {Post.postDate}
              </Grid.Column>
              <Grid.Column width={1} floated="right" >
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(Post.postId)}
                  style={{marginLeft:'-60px'}}
                >
                  {/* <Icon name="pencil"/> */}
                  Edit
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onPostDelete(Post.postId)}
                  style={{marginLeft:'-80px'}}
                >
                  {/* <Icon name="delete" /> */}
                  Delete
                </Button>
              </Grid.Column>
              {Post.attachmentUrl && (
                <Image src={Post.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculatepostDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
  getcreatedDate(): string {
    const date = new Date()

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
  
  
}
