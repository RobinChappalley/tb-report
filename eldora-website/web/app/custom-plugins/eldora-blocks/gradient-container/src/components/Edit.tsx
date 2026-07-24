import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { GradientContainerBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: GradientContainerBlock;
  setAttributes: (attributes: GradientContainerBlock) => void;
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
        <div className="gradient-container-preview">
          <InnerBlocks />
        </div>
      </div>
    </>
  );
};

export default Edit;
