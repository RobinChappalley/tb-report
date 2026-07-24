import { InnerBlocks, InspectorControls, RichText, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { IntroTitleContainerBlock } from "../types/block";
import { PanelBody } from "@wordpress/components";

type Props = {
  clientId: string;
  attributes: IntroTitleContainerBlock;
  setAttributes: (attributes: IntroTitleContainerBlock) => void;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();

  setAttributes({
    ...attributes,
    id: clientId,
  });

  return (
    <>
      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètres ancres">
          {/* -- Title -- */}
          <label>Titre</label>
          <RichText
            value={attributes.title}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                title: content,
              })
            }
          />
        </PanelBody>
      </InspectorControls>
      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="intro-title-container-preview">
          <RichText
            value={attributes.title}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                title: content,
              })
            }
            placeholder="Titre"
            className="intro-title-container-title"
          />
          <InnerBlocks
            allowedBlocks={["eldora/intro-title"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
            template={[
              ["eldora/intro-title"]
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
