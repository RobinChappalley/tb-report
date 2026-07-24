import { FullScreenImageBlock } from "../types/block";
import { useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: FullScreenImageBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `eldora-full-screen-image-${attributes.id}`,
    className: `full-screen-image`,
  });

  const adaptPoint = (n: number) => {
    return n * 100 + "%";
  };

  return (
    <div {...blockProps}>
      {!attributes.videoUrl ? (
        <div className={`gradient gradient-${attributes.gradientDirection}`}>
          <picture>
            <source
              media="(max-width: 720px)"
              srcSet={attributes.mediaSizes?.large}
            />
            <img
              style={{
                objectPosition: `${adaptPoint(
                  attributes.focalPoint.x,
                )} ${adaptPoint(attributes.focalPoint.y)}`,
              }}
              src={attributes.imageUrl}
              alt={attributes.imageAlt}
            />
          </picture>
        </div>
      ) : (
        <iframe
          src={attributes.videoUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default Save;
