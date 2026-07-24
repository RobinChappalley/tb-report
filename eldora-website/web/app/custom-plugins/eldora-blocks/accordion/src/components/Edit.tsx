import {
  InnerBlocks,
  InspectorControls,
  RichText,
  useBlockProps,
} from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";
import "../styles/editor.scss";
import { AccordionBlock } from "../types/block";
import { close } from "@wordpress/icons";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: AccordionBlock;
  setAttributes: (attributes: AccordionBlock) => void;
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
      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètres accordéon">
          {/* -- Title -- */}
          <TextControl
            label="Titre"
            value={attributes.title}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                title: value,
              })
            }
          />

          {/* -- Subtitle -- */}
          <TextControl
            label="Sous-titre"
            value={attributes.subtitle}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                subtitle: value,
              })
            }
          />
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="accordion-preview">
          <div className="icon">{close}</div>
          <RichText
            tagName="div"
            value={attributes.title}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                title: content,
              })
            }
            placeholder="Titre"
            className="title"
            allowedFormats={[]}
          />

          <RichText
            tagName="div"
            value={attributes.subtitle}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                subtitle: content,
              })
            }
            placeholder="Sous-titre"
            className="subtitle"
            allowedFormats={[]}
          />

          <InnerBlocks
            allowedBlocks={["eldora/media", "core/heading", "core/paragraph"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
