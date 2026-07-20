const DetectSearchEngine = userAgent => {
  const searchEngineList = [
    'googlebot',
    'adsbot-google',
    'mediapartners-google',
    'duckduckbot',
    'slurp',
    'baidu',
    'aolbuild',
    'msnbot',
    'bingbot',
    'bingpreview',
    'teoma',
    'yandex',
  ];

  // Check for every item in searchEngineList if it is NOT included in the user agent string.
  // If it is included, condition return FALSE and the loop is stopped.
  return !searchEngineList.every(
    searchEngine => !userAgent.toLowerCase().includes(searchEngine)
  );
};
export default DetectSearchEngine;
