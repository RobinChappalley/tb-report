import { ImageTextCardBlock } from "../types/block";
import { useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: ImageTextCardBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `image-text-card-${attributes.id}`,
    className: "image-text-card",
  });

  // Use the best available image size for the default img tag
  const defaultImageSrc = attributes.imageSize?.large || attributes.imageSize?.medium || attributes.image;

  return (
    <div {...blockProps}>
      <a href={attributes.link}>
        <div className="image-container">
          <picture>
            {attributes.imageSize?.large && <source srcSet={attributes.imageSize.large} media="(min-width: 768px)" />}
            {attributes.imageSize?.medium && <source srcSet={attributes.imageSize.medium} media="(min-width: 768px)" />}
            {attributes.imageSize?.thumbnail && (
              <source srcSet={attributes.imageSize.thumbnail} media="(min-width: 320px)" />
            )}
            <img className="image" src={defaultImageSrc} alt={attributes.imageAlt} />
          </picture>
        </div>

        <div className="title">{attributes.title}</div>

        <div className="text">{attributes.text}</div>

        <div className="link-text">
          {attributes.linkText}
          <svg className="icon">
            <use xlinkHref={`/app/themes/eldora-theme/assets/icons/icons.svg#arrow-right`} />
          </svg>
        </div>
      </a>
    </div>
  );
};

export default Save;
