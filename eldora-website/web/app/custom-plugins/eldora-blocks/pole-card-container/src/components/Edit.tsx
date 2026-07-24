import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { PoleCardContainerBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: PoleCardContainerBlock;
  setAttributes: (attributes: PoleCardContainerBlock) => void;
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
        <div className="pole-card-container-preview">
          <InnerBlocks
            allowedBlocks={["eldora/pole-card"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
