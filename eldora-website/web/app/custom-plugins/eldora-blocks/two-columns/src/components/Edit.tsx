import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { TwoColumnsBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: TwoColumnsBlock;
  setAttributes: (attributes: TwoColumnsBlock) => void;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  return (
    <>
      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="two-columns-preview">
          <InnerBlocks
            template={[
              ["eldora/two-columns-column"],
              ["eldora/two-columns-column"],
            ]}
            templateLock="all"
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
