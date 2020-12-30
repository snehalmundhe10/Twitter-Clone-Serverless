import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

import Auth from './auth/Auth'
import { EditPost } from './components/EditPost'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Posts } from './components/AllPosts'
import { Feed } from './components/Feed'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

let styles = {
  marginRight: '50px',
  width: '20px',
  height: '100px',
  color: 'twitter',
  verticalAlign: 'center'
};
export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)

    this.handleLogin = this.handleLogin.bind(this)
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleLogin() {
    this.props.auth.login()
  }

  handleLogout() {
    this.props.auth.logout()
  }

  
  render() {
    return (
      <div>
        <div style={{ backgroundColor: "white" }}>
         <div style={ styles}>
        {/* <h2 style={{marginLeft:'650px', marginTop: '100px'}}> */}
          {/* Twitter</h2> */}
        <img 
        src="data:image/png;base64,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"
        alt="twitter"
        style={{height:'180px', marginLeft:'600px', marginTop:'30px'}}/>
        </div> 
        <Segment style={{ padding: '8em 0em', marginLeft:'350px', marginTop:'100px' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={13}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        </div>
      </div>
    )
  }

  generateMenu() {
    return (
    
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Tweets</Link>
        </Menu.Item>
        <Menu.Item name="Feed">
          <Link to="/feed">What's happening?</Link>
        </Menu.Item>

        <Menu.Menu position="right">{this.logInLogOutButton()}</Menu.Menu>
      </Menu>
    )
  }

  logInLogOutButton() {
    if (this.props.auth.isAuthenticated()) {
      return (
        <Menu.Item name="logout" onClick={this.handleLogout}>
          Log Out
        </Menu.Item>
      )
    } else {
      return (
        <Menu.Item name="login" onClick={this.handleLogin}>
          Log In
        </Menu.Item>
      )
    }
  }

  generateCurrentPage() {
    if (!this.props.auth.isAuthenticated()) {
      return <LogIn auth={this.props.auth} />
    }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Posts {...props} auth={this.props.auth} />
          }}
        />

        <Route
          path="/posts/:postId/edit"
          exact
          render={props => {
            return <EditPost {...props} auth={this.props.auth} />
          }}
        />

        
         <Route
          path="/feed"
          exact
          render={props => {
            return <Feed {...props} auth={this.props.auth} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}
