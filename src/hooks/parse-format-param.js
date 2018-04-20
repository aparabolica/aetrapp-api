module.exports = async context => {
  const { query } = context.params;

  if (query && query.format && query.format == 'csv') {
    context.params.format = 'csv';
    context.params.paginate = false;
  }

  delete context.params.query.format;

  return context;
}
