import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { ParentCardContainerBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: ParentCardContainerBlock;
  setAttributes: (attributes: ParentCardContainerBlock) => void;
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
        <div className="parent-card-container-preview">
          <InnerBlocks
            allowedBlocks={["eldora/parent-card"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
            template={[
              ["eldora/parent-card"],
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
