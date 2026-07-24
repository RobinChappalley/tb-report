import { TwoColumnsBlock } from "../types/block";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

type Props = {
  attributes: TwoColumnsBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `eldora-two-columns-${attributes.id}`,
    className: `two-columns`,
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
};

export default Save;
