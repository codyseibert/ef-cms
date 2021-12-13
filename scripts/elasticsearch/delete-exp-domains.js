const AWS = require('aws-sdk');
const es = new AWS.ES({ region: 'us-east-1' });

(async () => {
  const { DomainNames } = await es.listDomainNames().promise();

  const expDomains = DomainNames.filter(({ DomainName }) =>
    DomainName.includes('-exp'),
  );

  for (let domain of expDomains) {
    await es
      .deleteElasticsearchDomain({ DomainName: domain.DomainName })
      .promise();
    console.log('deleting domain: ', domain.DomainName);
    await new Promise(resolve => setTimeout(resolve, 60000));
  }
})();
