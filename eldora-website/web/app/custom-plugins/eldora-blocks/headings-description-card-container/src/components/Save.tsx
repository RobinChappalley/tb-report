import { HeadingsDescriptionCardContainerBlock } from "../types/block";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: HeadingsDescriptionCardContainerBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `headings-description-card-container-${attributes.id}`,
    className: "headings-description-card-container",
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
};

export default Save;
