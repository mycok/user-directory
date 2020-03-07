import elasticsearch from 'elasticsearch';

const db = new elasticsearch.Client({
  host: process.env.BONSAI_URL || `${process.env.ELASTICSEARCH_PROTOCOL}://${process.env.ELASTICSEARCH_HOSTNAME}:${process.env.ELASTICSEARCH_PORT}`,
});

export default db;
