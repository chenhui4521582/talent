export const serialize = (url: string, values: object) => {
  const urlParam = new URL(window.location.origin + url);
  Object.keys(values).map(item => {
    if (values[item]) {
      urlParam.searchParams.append(item, values[item]);
    }
  });
  console.log(urlParam.href)
  return urlParam.href;
};
