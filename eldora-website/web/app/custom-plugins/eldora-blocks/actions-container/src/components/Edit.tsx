import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { ActionsContainerBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: ActionsContainerBlock;
  setAttributes: (attributes: ActionsContainerBlock) => void;
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
        <div className="actions-container-preview">
          <InnerBlocks
            allowedBlocks={["eldora/action"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
