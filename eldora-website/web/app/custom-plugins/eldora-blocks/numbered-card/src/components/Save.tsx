import { NumberedCardBlock } from "../types/block";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: NumberedCardBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `numbered-card-${attributes.id}`,
    className: "numbered-card",
  });

  if (!attributes.title && !attributes.text) {
    return <></>;
  }

  return (
    <div {...blockProps}>
      <div className="number-title-card">
        <div className="number h2">{attributes.number}</div>
        <h6 className="title h6">{attributes.title}</h6>
      </div>

      <div className="text">{attributes.text}</div>
    </div>
  );
};

export default Save;
