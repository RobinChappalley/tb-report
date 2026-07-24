import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { HeadingsDescriptionCardContainerBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: HeadingsDescriptionCardContainerBlock;
  setAttributes: (attributes: HeadingsDescriptionCardContainerBlock) => void;
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
        <div className="headings-description-card-container-preview">
          <InnerBlocks
            allowedBlocks={["eldora/headings-description-card"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
            template={[
              ["eldora/headings-description-card"]
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
