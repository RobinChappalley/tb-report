import axios from 'axios';
import login from 'client/queries/login';
import postsSearchQuery from 'client/queries/postsSearchQuery';
import previewQuery from 'client/queries/previewQuery';
import refreshToken from 'client/queries/refreshToken';
import resetUserPassword from 'client/queries/resetUserPassword';
import sendPasswordResetEmail from 'client/queries/sendPasswordResetEmail';
import siteConfigQuery from 'client/queries/siteConfigQuery';

import config from 'config/config';

const post =
  (query, hasCredentials = false, customHeaders = {}) =>
  // eslint-disable-next-line consistent-return
  async params => {
    const response = await axios.post(
      config.apiHost,
      { query: query(params) },
      {
        headers: { 'Content-Type': 'application/json', ...customHeaders },
        withCredentials: hasCredentials,
      }
    );
    return response.data.data;
  };

export const getSiteConfig = post(siteConfigQuery);
export const getPostsSearch = post(postsSearchQuery);
export const getLogin = post(login);
export const getrefreshedToken = post(refreshToken);
export const getResetUserPassword = post(resetUserPassword);
export const getSendPasswordResetEmail = post(sendPasswordResetEmail);
export const getPreview = customHeaders =>
  post(previewQuery, true, customHeaders);
