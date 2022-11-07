// const formatDate = (value, format = 'YYYY-MM-DD') => {
//   return value ? this.$dateFormat(new Date(value), format) : ''; // dayjs(value).format(format) : '';
// };
// const formatDateTime = (value, format = 'YYYY-MM-DD HH:mm') => {
//   return value ? this.$dateFormat(new Date(value), format) : ''; // dayjs(value).format(format) : '';
// };
const getDicValue = (value, dic) => {
  const n = Number(value);
  const obj = dic && dic.filter((o) => o.code === n)[0];
  const dicValue = obj ? obj.value : value;

  return Object.is(n, NaN) ? value : dicValue;
};

export default {
  filters: {
    // formatDateTime,
    // formatDate,
    getDicValue,
  },
  methods: {
    // formatDateTime,
    // formatDate,
    getDicValue,
  },
};
