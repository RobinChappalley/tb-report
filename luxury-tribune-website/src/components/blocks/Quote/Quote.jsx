import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

const Quote = ({ quote, attributes }) => (
  <div className="content-container">
    <div
      className={clsx(
        'quote quote-multiple-borders',
        attributes.align === 'right' ? 'quote-align-right' : 'quote-align-left'
      )}
    >
      <Icon name="quote" className="!text-orange !text-28" />
      <p className="font-soehneLeicht text-21 md:text-25 leading-35 tracking-tightish mt-10 mb-15">
        {quote.quote}
      </p>
      <p className="font-soehneKraftig text-12 leading-16 tracking-wide uppercase mb-25">
        {quote.author}
      </p>
    </div>
  </div>
);

Quote.propTypes = {
  quote: PropTypes.object,
  attributes: PropTypes.object,
};

Quote.defaultProps = {
  quote: {
    author: 'Author',
    quote: 'Quote content',
  },
  attributes: {
    align: 'left',
  },
};

export default Quote;
