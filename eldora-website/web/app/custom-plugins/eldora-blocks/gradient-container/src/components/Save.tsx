import { GradientContainerBlock } from "../types/block";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: GradientContainerBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `gradient-container-${attributes.id}`,
    className: "gradient-container",
  });

  return (
    <div {...blockProps}>
      <div className="gradient-up blocks-container">
        <InnerBlocks.Content />
      </div>
    </div>
  );
};

export default Save;
