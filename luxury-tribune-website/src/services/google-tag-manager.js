import TagManager from 'react-gtm-module';

const init = options => {
  TagManager.initialize({
    gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER,
    ...options,
  });
};

const dl = dataLayer => {
  TagManager.dataLayer({ dataLayer });
};

const event = (name = 'event', data = {}) => {
  TagManager.dataLayer({
    dataLayer: { event: name, ...data },
  });
};

const reset = (dataLayerName = 'dataLayer') =>
  // eslint-disable-next-line camelcase
  window?.google_tag_manager?.[process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER]?.[
    dataLayerName
  ]?.reset();

export default {
  init,
  dl,
  event,
  reset,
};
