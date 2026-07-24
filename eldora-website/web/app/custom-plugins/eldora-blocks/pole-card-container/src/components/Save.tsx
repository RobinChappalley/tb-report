import { PoleCardContainerBlock } from "../types/block";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: PoleCardContainerBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `pole-card-container-${attributes.id}`,
    className: "pole-card-container",
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
};

export default Save;
