import config from '../config/config';

const getRestApiUrlPath = (url, params = []) => {
  let path = `${config.restApiHost}${url}`;

  if (params.length > 0) {
    path = params.reduce(
      (acc, { key, value }, currentIndex) =>
        `${acc}${currentIndex === 0 ? '?' : '&'}${key}=${value}`,
      path
    );
  }

  return encodeURI(path);
};

export default getRestApiUrlPath;
