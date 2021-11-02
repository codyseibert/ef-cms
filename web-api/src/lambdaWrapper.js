const { get } = require('lodash');

export const LAMBDA_TIMEOUT_PUBLIC = 1 * 60 * 1000; // 1 minute timeout
export const LAMBDA_TIMEOUT_INTERNAL = 20 * 60 * 1000; // 20 minute timeout (for async lambdas)

const RESPONSE_HEADERS_COMMON = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
};

export const RESPONSE_HEADERS_PUBLIC = {
  ...RESPONSE_HEADERS_COMMON,
};

export const RESPONSE_HEADERS_INTERNAL = {
  ...RESPONSE_HEADERS_COMMON,
  'Cache-Control': 'max-age=0, private, no-cache, no-store, must-revalidate',
  Pragma: 'no-cache',
  Vary: 'Authorization',
};

const sendLambdaResponse = ({ lambdaResponse, res }) => {
  if (
    ['application/pdf', 'text/html'].includes(
      lambdaResponse.headers['Content-Type'],
    )
  ) {
    res.set('Content-Type', lambdaResponse.headers['Content-Type']);
    res.send(lambdaResponse.body);
  } else if (lambdaResponse.headers['Content-Type'] === 'application/json') {
    res.send(JSON.parse(lambdaResponse.body || 'null'));
  } else if (lambdaResponse.headers.Location) {
    res.redirect(lambdaResponse.headers.Location);
  } else {
    console.log('ERROR: we do not support this return type');
  }
};

export const lambdaWrapperPublic = lambda => async (req, res) => {
  let isTerminalUser =
    get(req, 'apiGateway.event.requestContext.authorizer.isTerminalUser') ===
    'true';

  const event = {
    headers: req.headers,
    isTerminalUser,
    path: req.path,
    pathParameters: req.params,
    queryStringParameters: req.query,
  };
  req.setTimeout(LAMBDA_TIMEOUT_PUBLIC);

  const lambdaResponse = await lambda({
    ...event,
    body: JSON.stringify(req.body),
    logger: req.locals.logger,
  });

  res.status(lambdaResponse.statusCode);
  res.set({
    ...RESPONSE_HEADERS_PUBLIC,
    'X-Terminal-User': isTerminalUser,
  });

  sendLambdaResponse({ lambdaResponse, res });
};

export const lambdaWrapper = lambda => async (req, res) => {
  const event = {
    headers: req.headers,
    path: req.path,
    pathParameters: req.params,
    queryStringParameters: req.query,
  };

  req.setTimeout(LAMBDA_TIMEOUT_INTERNAL);

  const lambdaResponse = await lambda({
    ...event,
    body: JSON.stringify(req.body),
    logger: req.locals.logger,
  });

  res.status(lambdaResponse.statusCode);
  res.set(RESPONSE_HEADERS_INTERNAL);

  sendLambdaResponse({ lambdaResponse, res });
};
