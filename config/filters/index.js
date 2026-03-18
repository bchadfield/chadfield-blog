const dayjs = require('dayjs');

const toISOString = dateString => dayjs(dateString).toISOString();
const formatDate = (date, format) => dayjs(date).format(format);

module.exports = {
  toISOString,
  formatDate
};
