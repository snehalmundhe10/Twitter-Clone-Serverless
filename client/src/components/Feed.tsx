import * as React from 'react'
import { Form } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import {
    Grid,
    Icon,
    Input,
    Image,
    Loader
  } from 'semantic-ui-react'

interface FeedProps{
    auth: Auth
}
interface FeedState{
   
   feed: Feed[],
   userTestStatus :any[]
}

export class Feed extends React.PureComponent<
FeedProps,
FeedState
> {
    state: FeedState ={
      feed : [],
       userTestStatus : [
        { "id": 0, "name": "Available" },
        { "id": 1, "name": "Ready" },
        { "id": 2, "name": "Started" }
      ]
    }

    handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault(); 
        this.setState({
            feed: this.state.userTestStatus
        });
    } 
    render(){
        return(
            <div>
                <br/>
                <h3 style ={{color: 'black'}}> Trends For You</h3>
                <br/>
                <Grid>
                <hr style={{ width:'650px', marginRight:'150px'}}></hr>
                    <Grid.Row>
                        <Grid.Column>
                            <div>
                            <h5> Music   |   Trending </h5>
                            <p>  <b>Stray Kids</b>   |  210K Tweets
                            </p>
                            </div> 
                        </Grid.Column>
                    </Grid.Row>
                    <hr style={{ width:'650px', marginRight:'150px'}}></hr>
                    <Grid.Row>
                        <Grid.Column>
                            <div>
                            <h5> Politics   |   Trending </h5>
                            <p>  <b>China</b>   |  656K Tweets
                            </p>
                            </div> 
                        </Grid.Column>
                    </Grid.Row>
                    <hr style={{ width:'650px', marginRight:'150px'}}></hr>
                    <Grid.Row>
                        <Grid.Column>
                            <div>
                            <h5> COVID19   |   Trending </h5>
                            <p>  <b>Vaccine</b>   |  874K Tweets
                            </p>
                            </div> 
                        </Grid.Column>
                    </Grid.Row>
                    <hr style={{ width:'650px', marginRight:'150px'}}></hr>
                    <Grid.Row>
                        <Grid.Column>
                            <div>
                            <h5> New Year   |   Trending </h5>
                            <p>  <b>Welcome 2021</b>   |  578K Tweets
                            </p>
                            </div> 
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        )
    } 

}