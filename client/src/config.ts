// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'gm9bk8zan6'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
   domain: 'dev-r5ywc3ht.us.auth0.com',            // Auth0 domain
   clientId: 'nkQH2QuD5ZeZaUFeLn59KAW90zYWWmHJ',          // Auth0 client id
   callbackUrl: 'http://localhost:3000/callback'
}
