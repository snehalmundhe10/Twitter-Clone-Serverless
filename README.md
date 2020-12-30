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

![Alt text]( )
![Alt text]( )

![Alt text]( )

![Alt text]( )

![Alt text]( )

![Alt text]( )

![Alt text]( )

![Alt text]( )

![Alt text]( )

![Alt text]( )

## Author
Snehal Mundhe


