const {
  prepareDateFromString,
} = require('../../../business/utilities/DateHandler');
const { search } = require('../searchClient');

exports.getSectionOutboxMessages = async ({ applicationContext, section }) => {
  const filterDate = prepareDateFromString()
    .startOf('day')
    .subtract(7, 'd')
    .utc()
    .format();

  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                'fromSection.S': { operator: 'and', query: section },
              },
            },
            {
              range: {
                'createdAt.S': {
                  format: 'strict_date_time', // ISO-8601 time stamp
                  gte: filterDate,
                },
              },
            },
          ],
        },
      },
      size: 5000,
    },
    index: 'efcms-message',
  };

  const { results } = await search({
    applicationContext,
    searchParameters: query,
  });

  return results;
};
