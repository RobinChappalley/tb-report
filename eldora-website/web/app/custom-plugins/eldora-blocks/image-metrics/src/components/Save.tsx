import { ImageMetricsBlock } from "../types/block";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: ImageMetricsBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `image-metrics-${attributes.id}`,
    className: "image-metrics",
  });

  const adaptPoint = (n: number) => {
    return n * 100 + "%";
  };

  return (
    <div {...blockProps}>
      <div
        className={`image-container gradient-direction-${attributes.gradientDirection}`}
      >
        {attributes.imageUrl && (
          <picture>
            <source
              media="(max-width: 1280px)"
              srcSet={attributes.imageSizes?.large}
              type="image/webp"
            />
            <img
              className="image"
              style={{
                objectPosition: `${adaptPoint(
                  attributes.focalPoint.x,
                )} ${adaptPoint(attributes.focalPoint.y)}`,
              }}
              src={attributes.imageUrl}
              alt={attributes.imageAlt}
            />
          </picture>
        )}

        <div className="image-metrics-number-grid">
          <div className="image-metrics-number-container">
            <InnerBlocks.Content />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Save;
