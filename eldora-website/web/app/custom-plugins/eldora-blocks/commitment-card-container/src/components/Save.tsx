import { CommitmentCardContainerBlock } from "../types/block";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: CommitmentCardContainerBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `commitment-card-container-${attributes.id}`,
    className: "commitment-card-container",
  });

  return (
    <div {...blockProps}>
      <div className="commitment-card-container-layout">
        <InnerBlocks.Content />
      </div>
    </div>
  );
};

export default Save;
