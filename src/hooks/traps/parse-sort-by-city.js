/*
 * Parse sort by city
 */

module.exports = () => {
  return function (context) {

    const { query } = context.params;

    if (query && query.$sort && query.$sort['city']) {

      const City = context.app.services.cities.Model;

      const sortOrder = parseInt(query.$sort['city']) == -1 ? 'DESC' : 'ASC';

      context.params.sequelize = {
        include: [{ model: City, attributes: ['id', 'stateId', 'name'] }],
        order: [[City, 'stateId', sortOrder], [City, 'name', sortOrder]]
      }

      delete query.$sort['city'];
    };

    return context;
  }
};
