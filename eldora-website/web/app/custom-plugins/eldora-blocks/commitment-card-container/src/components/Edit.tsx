import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { CommitmentCardContainerBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: CommitmentCardContainerBlock;
  setAttributes: (attributes: CommitmentCardContainerBlock) => void;
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
        <div className="commitment-card-container-preview">
          <InnerBlocks
            allowedBlocks={["eldora/commitment-card"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
            template={[
              ["eldora/commitment-card"]
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
