const ptTopx = 4 / 3;
const labels = [
  {
    label: 12
  },
  {
    label: 14
  },
  {
    label: 16
  },
  {
    label: 18
  },
  {
    label: 22
  },
  {
    label: 24
  },
  {
    label: 30
  },
  {
    label: 36
  },
  {
    label: 48
  },
  {
    label: 56
  },
  {
    label: 72
  },
  {
    label: 80
  },
  {
    label: 92
  }
];
const sizeList = labels.map(item => {
  return {
    value: String(ptTopx * item.label),
    label: item.label
  };
});
export default sizeList;
