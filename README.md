# Twitter Clone with Serverless Framework

## Overview

Twitter Clone developed using Serverless Framework. This application shows trending Twitter Topics. This application allows to create tweets with word limit 280 characters. Each tweet can optionally allows an attachment image. Each user only has access to their Twitter accounts that he/she has created.

# Functions implemented

* `Auth` - Implement a custom authorizer for API Gateway that is added to all other functions.

* `Get Tweets` - Return all Tweets for a current user. A user id is extracted from a JWT token that is sent by the frontend

* `Create Tweets` - Create a new Tweet for a current user. 

* `Update Tweets` - Update a Tweet created by a current user. 

* `Delete Tweets` - Delete a Tweet created by a current user. Expects an id of a Tweet to remove.

* `Generate Upload Url` - Return a pre-signed URL that can be used to upload an attachment file for a Tweet.


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless TODO application.

# Screenshots of the application
1. Home 
![Alt text](https://github.com/snehalmundhe10/serverless-capstone/blob/main/screenshots/1.%20home.png)

2. Login Auth0
![Alt text](https://github.com/snehalmundhe10/serverless-capstone/blob/main/screenshots/2.%20Auth0.png)

3. Login Auth0
![Alt text](https://github.com/snehalmundhe10/serverless-capstone/blob/main/screenshots/3.%20Auth0%20login.png)

4. Get all Tweets
![Alt text](https://github.com/snehalmundhe10/serverless-capstone/blob/main/screenshots/10.%20All%20tweets-2.png)

5. Twitter Trends
![Alt text](https://github.com/snehalmundhe10/serverless-capstone/blob/main/screenshots/5.%20Trends%20.png)

6. Upload attachment to a tweet
![Alt text](https://github.com/snehalmundhe10/serverless-capstone/blob/main/screenshots/8.%20File%20Upload.png)

7. Delete a tweet
![Alt text](https://github.com/snehalmundhe10/serverless-capstone/blob/main/screenshots/11.%20delete%20Tweets.png)

## Author
Snehal Mundhe


