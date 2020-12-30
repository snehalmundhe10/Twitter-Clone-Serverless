import * as React from 'react'
import Auth from '../auth/Auth'
import { Button } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <div>
        <br/>
        <h3>Join Twitter Today</h3>
        <Button onClick={this.onLogin} size="medium" color="twitter">
          Log in
        </Button>
      </div>
    )
  }
}
