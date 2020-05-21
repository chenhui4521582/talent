export function getLevel() {
  const data = <string[]>[];
  const lines = ['T', 'P', 'C', 'S'];
  const mids = [1, 2, 3, 4, 5];
  const smalls = [1, 2, 3];
  lines.map(line => {
    mids.map(mid => {
      smalls.map(small => {
        data.push(line + mid + '-' + small);
      })
    })
  })
  return data;
}