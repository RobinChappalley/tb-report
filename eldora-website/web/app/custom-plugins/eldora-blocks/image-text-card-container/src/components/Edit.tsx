import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { ImageTextCardContainerBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: ImageTextCardContainerBlock;
  setAttributes: (attributes: ImageTextCardContainerBlock) => void;
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
        <div className="image-text-card-container-preview">
          <InnerBlocks
            allowedBlocks={["eldora/image-text-card"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
            template={[
              ["eldora/image-text-card"]
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
