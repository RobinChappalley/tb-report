import { ImageTextCardContainerBlock } from "../types/block";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: ImageTextCardContainerBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `image-text-card-container-${attributes.id}`,
    className: "image-text-card-container",
  });

  return (
    <div {...blockProps}>
      <div className="children-container">
        <InnerBlocks.Content />
      </div>
    </div>
  );
};

export default Save;
