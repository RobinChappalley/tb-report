import React from 'react';
import PropTypes from 'prop-types';

const DigitalProduct = ({ digitalProduct }) => {
  const {
    digitalProductTitle,
    digitalProductSurTitle,
    digitalProductDescription,
    digitalProductButtonText,
    digitalProductBuyLink,
    digitalProductPrice,
    digitalProductImage,
    digitalProductSinglePageLink,
    digitalProductSinglePageLinkLabel,
  } = digitalProduct;

  return (
    <div className="digital-product-container">
      <div className="digital-product">
        <div className="digital-product__content">
          <div className="digital-product__text-content">
            <h3 className="digital-product__sur-title">
              {digitalProductSurTitle}
            </h3>
            {digitalProductTitle && !digitalProductSinglePageLink && (
              <h2 className="digital-product__title">{digitalProductTitle}</h2>
            )}
            {digitalProductTitle && digitalProductSinglePageLink && (
              <h2 className="digital-product__title">
                <a
                  href={digitalProductSinglePageLink.url}
                  target={digitalProductSinglePageLink.target}
                >
                  {digitalProductTitle}
                </a>
              </h2>
            )}
            <p className="digital-product__description">
              {digitalProductDescription}
            </p>

            {digitalProductSinglePageLink && (
              <a
                href={digitalProductSinglePageLink.url}
                target={digitalProductSinglePageLink.target}
                className="digital-product__link"
              >
                {digitalProductSinglePageLinkLabel}
              </a>
            )}
          </div>

          <div className="digital-product__ctas">
            <a
              href={digitalProductBuyLink}
              className="digital-product__button"
              target="_blank"
              rel="noreferrer"
            >
              {digitalProductButtonText}
            </a>
            <div className="digital-product__price">{digitalProductPrice}</div>
          </div>
        </div>

        {digitalProductImage?.node && !digitalProductSinglePageLink && (
          <div className="digital-product__image">
            <img
              src={digitalProductImage.node.sourceUrl}
              alt={digitalProductImage.node.altText || digitalProductTitle}
              className="digital-product__img"
            />
          </div>
        )}
        {digitalProductImage?.node && digitalProductSinglePageLink && (
          <div className="digital-product__image">
            <a
              target={digitalProductSinglePageLink.target}
              href={digitalProductSinglePageLink.url}
            >
              <img
                src={digitalProductImage.node.sourceUrl}
                alt={digitalProductImage.node.altText || digitalProductTitle}
                className="digital-product__img"
              />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

DigitalProduct.propTypes = {
  digitalProduct: PropTypes.object,
};

DigitalProduct.defaultProps = {
  digitalProduct: {
    digitalProductTitle: '',
    digitalProductSurTitle: '',
    digitalProductDescription: '',
    digitalProductButtonText: 'Acheter',
    digitalProductBuyLink: '',
    digitalProductPrice: '0€',
    digitalProductImage: null,
    digitalProductSinglePageLink: null,
    digitalProductSinglePageLinkLabel: '',
    digitalProductProductId: '',
  },
};

export default DigitalProduct;
