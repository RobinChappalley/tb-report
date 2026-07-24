import { MediaBlock } from "../types/block";
import { useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: MediaBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `eldora-media-${attributes.id}`,
    className: `eldora-media`,
  });

  return (
    <div {...blockProps}>
      {!attributes.videoUrl ? (
        <picture>
          <source
            media="(max-width: 1280px)"
            srcSet={attributes.mediaSizes?.large}
          />
          <img
            className="image"
            src={attributes.imageUrl}
            alt={attributes.imageAlt}
          />
        </picture>
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
