import { ImageCarouselStaticBlock } from "../types/block";
import { useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: ImageCarouselStaticBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `image-carousel-static-${attributes.id}`,
    className: "image-carousel-static",
  });

  const adaptPoint = (n: number) => {
    return n * 100 + "%";
  };

  return (
    <div {...blockProps}>
      <div className="embla-mobile-slider">
        <div className="embla__container images-area">
          {attributes.images?.map((image, index) => {
            if (!image?.url) return null;

            return (
              <picture key={index} className="embla__slide">
                <source
                  media="(max-width: 1280px)"
                  srcSet={image?.sizes?.large}
                  type="image/webp"
                />
                <img
                  className={`image image-${index + 1}`}
                  style={{
                    objectPosition: `${adaptPoint(
                      image?.focalPoint?.x || 0.5,
                    )} ${adaptPoint(image?.focalPoint?.y || 0.5)}`,
                  }}
                  src={image?.url}
                  alt={image?.alt}
                />
              </picture>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Save;
