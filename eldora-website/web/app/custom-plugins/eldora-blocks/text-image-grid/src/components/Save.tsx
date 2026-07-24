import { TextImageGridBlock } from "../types/block";
import { useBlockProps } from "@wordpress/block-editor";
import clsx from "clsx";

type Props = {
  attributes: TextImageGridBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `text-image-grid-${attributes.id}`,
    className: "text-image-grid",
  });

  return (
    <div {...blockProps}>
      <div
        className={clsx("elements-container", {
          reverse: attributes.format === "one-image-left",
        })}
      >
        <div className="texts-area">
          {attributes.surtitle && (
            <div className="surtitle">{attributes.surtitle}</div>
          )}
          {attributes.title && <h4 className="h4 title">{attributes.title}</h4>}
          {attributes.text && <div className="text">{attributes.text}</div>}
          {attributes.link?.text && attributes.link?.url && (
            <a className="link" href={attributes.link?.url}>
              {attributes.link?.text}
            </a>
          )}
        </div>
        <div className={`images-area format-${attributes.format}`}>
          {attributes.images?.map((image, index) => {
            if (
              !image?.url ||
              (index > 0 && attributes.format !== "four-images")
            ) {
              return null;
            }
            return (
              <picture key={index}>
                <source
                  media="(max-width: 1280px)"
                  srcSet={image?.sizes?.large}
                  type="image/webp"
                />
                <img
                  className={`image image-${index + 1}`}
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
