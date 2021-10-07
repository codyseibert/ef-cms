const axios = require('axios');
const jwk = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const {
  createLogger,
} = require('../../../../shared/src/utilities/createLogger');
const { transports } = require('winston');

const transport = new transports.Console({
  handleExceptions: true,
  handleRejections: true,
});

const issMain = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID_MAIN}`;
const issIrs = `https://cognito-idp.us-east-1.amazonaws.com/${process.env.USER_POOL_ID_IRS}`;

const getLogger = context => {
  return createLogger({
    defaultMeta: {
      environment: {
        stage: process.env.STAGE,
      },
      requestId: {
        authorizer: context.awsRequestId,
      },
    },
    logLevel: context.logLevel,
    transports: [transport],
  });
};

const getToken = event => {
  if (event.queryStringParameters && event.queryStringParameters.token) {
    return event.queryStringParameters.token;
  } else if (event.authorizationToken) {
    return event.authorizationToken.substring(7);
  }
};

const decodeToken = requestToken => {
  const { header, payload } = jwk.decode(requestToken, { complete: true });
  return { iss: payload.iss, kid: header.kid };
};

let keyCache = {};
const getKeysForIssuer = async iss => {
  if (keyCache[iss]) {
    return keyCache[iss];
  }

  const response = await axios.get(`${iss}/.well-known/jwks.json`);

  return (keyCache[iss] = response.data.keys);
};

const verify = (key, token) =>
  new Promise((resolve, reject) => {
    const pem = jwkToPem(key);
    const options = { issuer: [issMain, issIrs] };

    jwk.verify(token, pem, options, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });

// {
//   "type": "REQUEST",
//   "methodArn": "arn:aws:execute-api:us-east-1:515554424717:92hhs5f6r4/exp2/$connect",
//   "headers": {
//     "Accept-Encoding": "gzip, deflate, br",
//     "Accept-Language": "en-US,en;q=0.9",
//     "Cache-Control": "no-cache",
//     "Connection": "upgrade",
//     "content-length": "0",
//     "Cookie": "_ga=GA1.2.1960628857.1584471294; _ga_JHPD8JG2WT=GS1.1.1628802358.8.1.1628802982.0",
//     "Host": "ws-blue.exp2.ustc-case-mgmt.flexion.us",
//     "Origin": "https://app.exp2.ustc-case-mgmt.flexion.us",
//     "Pragma": "no-cache",
//     "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
//     "Sec-WebSocket-Key": "6z2EtUz8YeI6fCCGSadNBA==",
//     "Sec-WebSocket-Version": "13",
//     "Upgrade": "websocket",
//     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
//     "X-Amzn-Trace-Id": "Root=1-615e12c6-746698e60dde6c902e972bff",
//     "X-Forwarded-For": "76.27.128.153",
//     "X-Forwarded-Port": "443",
//     "X-Forwarded-Proto": "https"
//   },
//   "multiValueHeaders": {
//     "Accept-Encoding": [
//       "gzip, deflate, br"
//     ],
//     "Accept-Language": [
//       "en-US,en;q=0.9"
//     ],
//     "Cache-Control": [
//       "no-cache"
//     ],
//     "Connection": [
//       "upgrade"
//     ],
//     "content-length": [
//       "0"
//     ],
//     "Cookie": [
//       "_ga=GA1.2.1960628857.1584471294; _ga_JHPD8JG2WT=GS1.1.1628802358.8.1.1628802982.0"
//     ],
//     "Host": [
//       "ws-blue.exp2.ustc-case-mgmt.flexion.us"
//     ],
//     "Origin": [
//       "https://app.exp2.ustc-case-mgmt.flexion.us"
//     ],
//     "Pragma": [
//       "no-cache"
//     ],
//     "Sec-WebSocket-Extensions": [
//       "permessage-deflate; client_max_window_bits"
//     ],
//     "Sec-WebSocket-Key": [
//       "6z2EtUz8YeI6fCCGSadNBA=="
//     ],
//     "Sec-WebSocket-Version": [
//       "13"
//     ],
//     "Upgrade": [
//       "websocket"
//     ],
//     "User-Agent": [
//       "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36"
//     ],
//     "X-Amzn-Trace-Id": [
//       "Root=1-615e12c6-746698e60dde6c902e972bff"
//     ],
//     "X-Forwarded-For": [
//       "76.27.128.153"
//     ],
//     "X-Forwarded-Port": [
//       "443"
//     ],
//     "X-Forwarded-Proto": [
//       "https"
//     ]
//   },
//   "queryStringParameters": {
//     "token": "eyJraWQiOiJrakVkaDhMR1E4ZjhxK2lYT1hqUW55NUpZRFVHWTJnaUlJVzl1aG5VbGdzPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiaS1DTzA2elp3VW1pT1ZxQnRBSU1XZyIsInN1YiI6IjM0MjQxNGFlLWUwYWMtNGIyYy1iYjg2LWY4YzIwZGRmODIwNyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV8xY1diTGVySEQiLCJjb2duaXRvOnVzZXJuYW1lIjoiMzQyNDE0YWUtZTBhYy00YjJjLWJiODYtZjhjMjBkZGY4MjA3Iiwib3JpZ2luX2p0aSI6IjQxOWQ0NGFjLTRjOWMtNGJkYi04NDFlLTBhNTRlYzVhMTBjYyIsImF1ZCI6Ijc4b2Jnb3ZoNGU1MWQ0aWQ3NzJjMHIwb3F1IiwiZXZlbnRfaWQiOiI5ZjA0NDJhMi03NmQ5LTQxMjUtOWY2OC1mN2QwOGY5Y2RhYjciLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYzMzU1NTEzNiwibmFtZSI6IlRlc3QgZG9ja2V0Y2xlcms0IiwiZXhwIjoxNjMzNTU4NzM2LCJjdXN0b206cm9sZSI6ImRvY2tldGNsZXJrIiwiaWF0IjoxNjMzNTU1MTM2LCJqdGkiOiJlYzdjNzVhZi1hYzEyLTRjYmQtODg5Yi00MTI2ZDdkY2RhZjEiLCJlbWFpbCI6ImRvY2tldGNsZXJrNEBleGFtcGxlLmNvbSJ9.roCyeZTv5pHoIpAoOsuU5_n4JIDBfQHoFdl_BYci5wwADy0XzYFwoO07tSKQoAox8nhc-htkAYY1LdbwYygL95KdVnPxT7-ZxiF6wA3GUDc2xAt_p7x-cLGBomIgYcjy8rrkcpKEqPra98doWgwuq9yel7KuAero6XOCD_ajKzMOiV8WVaeaO4VJGbU80Lfh1J9Ag56NW-ceWKY72Q-WjFr3CcY7Z2AZO1mdOmHzBA6lwTmRx-yfX7aZSc05CHkYfalqap7Jmmvci-Vsfo0WZAPPoq0JRjBiZSOZsV3EKwmgCRAWcvPwqsm4Vupx0Fuav-6qMkQz7gDVtXnG6dd19g"
//   },
//   "multiValueQueryStringParameters": {
//     "token": [
//       "eyJraWQiOiJrakVkaDhMR1E4ZjhxK2lYT1hqUW55NUpZRFVHWTJnaUlJVzl1aG5VbGdzPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiaS1DTzA2elp3VW1pT1ZxQnRBSU1XZyIsInN1YiI6IjM0MjQxNGFlLWUwYWMtNGIyYy1iYjg2LWY4YzIwZGRmODIwNyIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV8xY1diTGVySEQiLCJjb2duaXRvOnVzZXJuYW1lIjoiMzQyNDE0YWUtZTBhYy00YjJjLWJiODYtZjhjMjBkZGY4MjA3Iiwib3JpZ2luX2p0aSI6IjQxOWQ0NGFjLTRjOWMtNGJkYi04NDFlLTBhNTRlYzVhMTBjYyIsImF1ZCI6Ijc4b2Jnb3ZoNGU1MWQ0aWQ3NzJjMHIwb3F1IiwiZXZlbnRfaWQiOiI5ZjA0NDJhMi03NmQ5LTQxMjUtOWY2OC1mN2QwOGY5Y2RhYjciLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTYzMzU1NTEzNiwibmFtZSI6IlRlc3QgZG9ja2V0Y2xlcms0IiwiZXhwIjoxNjMzNTU4NzM2LCJjdXN0b206cm9sZSI6ImRvY2tldGNsZXJrIiwiaWF0IjoxNjMzNTU1MTM2LCJqdGkiOiJlYzdjNzVhZi1hYzEyLTRjYmQtODg5Yi00MTI2ZDdkY2RhZjEiLCJlbWFpbCI6ImRvY2tldGNsZXJrNEBleGFtcGxlLmNvbSJ9.roCyeZTv5pHoIpAoOsuU5_n4JIDBfQHoFdl_BYci5wwADy0XzYFwoO07tSKQoAox8nhc-htkAYY1LdbwYygL95KdVnPxT7-ZxiF6wA3GUDc2xAt_p7x-cLGBomIgYcjy8rrkcpKEqPra98doWgwuq9yel7KuAero6XOCD_ajKzMOiV8WVaeaO4VJGbU80Lfh1J9Ag56NW-ceWKY72Q-WjFr3CcY7Z2AZO1mdOmHzBA6lwTmRx-yfX7aZSc05CHkYfalqap7Jmmvci-Vsfo0WZAPPoq0JRjBiZSOZsV3EKwmgCRAWcvPwqsm4Vupx0Fuav-6qMkQz7gDVtXnG6dd19g"
//     ]
//   },
//   "stageVariables": {

//   },
//   "requestContext": {
//     "routeKey": "$connect",
//     "eventType": "CONNECT",
//     "extendedRequestId": "GzffAEYroAMFa1g=",
//     "requestTime": "06/Oct/2021:21:19:02 +0000",
//     "messageDirection": "IN",
//     "stage": "exp2",
//     "connectedAt": 1633555142215,
//     "requestTimeEpoch": 1633555142218,
//     "identity": {
//       "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36",
//       "sourceIp": "76.27.128.153"
//     },
//     "requestId": "GzffAEYroAMFa1g=",
//     "domainName": "ws-blue.exp2.ustc-case-mgmt.flexion.us",
//     "connectionId": "GzffAc3JIAMCFVQ=",
//     "apiId": "92hhs5f6r4"
//   }
// }

exports.handler = async (event, context) => {
  const logger = getLogger(context);
  const token = getToken(event);

  if (!token) {
    logger.info('No authorizationToken found in the header');

    throw new Error('Unauthorized'); // Magic string to return 401
  }

  const { iss, kid } = decodeToken(token);

  // TODO:
  // use the decoded token to figure out the user role
  // if the user role is terminal, fetch list of white-listed ip addresses
  // throw exception if requestContext.identity.sourceIp is not in the list
  // TODO: give this lambda permission to fetch from dynamo

  let keys;
  try {
    keys = await getKeysForIssuer(iss);
  } catch (error) {
    logger.warn(
      'Could not fetch keys for token issuer, considering request unauthorized',
      error,
    );

    throw new Error('Unauthorized'); // Magic string to return 401
  }

  const key = keys.find(k => k.kid === kid);

  if (!key) {
    logger.warn(
      'The key used to sign the authorization token was not found in the user pool’s keys, considering request unauthorized',
      {
        issuer: iss,
        keys,
        requestedKeyId: kid,
      },
    );

    throw new Error('Unauthorized'); // Magic string to return 401
  }

  let payload;
  try {
    payload = await verify(key, token);
  } catch (error) {
    logger.warn(
      'The token is not valid, considering request unauthorized',
      error,
    );

    throw new Error('Unauthorized'); // Magic string to return 401
  }

  const policy = {
    policyDocument: {
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn.split('/').slice(0, 2).join('/') + '/*',
        },
      ],
      Version: '2012-10-17',
    },
    principalId: payload['custom:userId'] || payload.sub,
  };

  logger.info('Request authorized', {
    metadata: { policy },
  });

  return policy;
};
