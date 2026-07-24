import { ImageMetricsNumberBlock } from "../types/block";
import { useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: ImageMetricsNumberBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `image-metrics-number-${attributes.id}`,
    className: "image-metrics-number",
  });

  return (
    <div {...blockProps}>
      {attributes.number && <div className="number">{attributes.number}</div>}
      {attributes.legend && <div className="legend">{attributes.legend}</div>}
    </div>
  );
};

export default Save;
