import { getToken } from '@/utils/cookies';

export const serialize = (url: string, values: object) => {
  const urlParam = new URL(window.location.origin + url);
  Object.keys(values).map(item => {
    if (values[item] || values[item] === 0) {
      urlParam.searchParams.append(item, values[item]);
    }
  });
  urlParam.searchParams.append('token', getToken('ods_token_front'));
  return urlParam.href;
};
