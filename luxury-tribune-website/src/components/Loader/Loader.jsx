import React from 'react';
import { Oval } from 'react-loader-spinner';

const LoadingData = () => (
  <Oval
    color="#ffffff"
    height={30}
    width={30}
    secondaryColor="#ffffff66"
    style={{
      lineHeight: '1',
    }}
  />
);

export default LoadingData;
