import { ParentCardBlock } from "../types/block";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: ParentCardBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `parent-card-${attributes.id}`,
    className: "parent-card",
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
};

export default Save;
