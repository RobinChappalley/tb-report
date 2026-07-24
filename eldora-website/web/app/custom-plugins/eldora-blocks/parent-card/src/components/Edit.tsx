import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { ParentCardBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: ParentCardBlock;
  setAttributes: (attributes: ParentCardBlock) => void;
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
        <div className="parent-card-preview">
          <InnerBlocks
            allowedBlocks={["core/heading", "core/paragraph", "eldora/media", "eldora/pole-card-container"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
            template={[
              ["core/heading", { content: "Titre", level: 5 }],
              ["core/paragraph", { content: "Contenu de la carte" }],
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
