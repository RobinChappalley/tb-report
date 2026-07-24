import { TwoColumnsColumnBlock } from "../types/block";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

type Props = {
  attributes: TwoColumnsColumnBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `eldora-two-columns-column-${attributes.id}`,
    className: `two-columns-column`,
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
};

export default Save;
