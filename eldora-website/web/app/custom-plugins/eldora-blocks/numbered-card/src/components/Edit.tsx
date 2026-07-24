import {
  InnerBlocks,
  InspectorControls,
  useBlockProps,
  RichText,
} from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";
import "../styles/editor.scss";
import { NumberedCardBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: NumberedCardBlock;
  setAttributes: (attributes: NumberedCardBlock) => void;
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
        <PanelBody title="Paramètres carte numérotée">
          {/* -- Title -- */}
          <TextControl
            label="Numéro"
            value={attributes.number}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                number: value,
              })
            }
          />

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

          {/* -- Text -- */}
          <label>Description</label>
          <RichText
            value={attributes.text}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                text: content,
              })
            }
          />
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="numbered-card-preview">
          <div className="number-title">
            <RichText
              tagName="div"
              value={attributes.number}
              onChange={(content) =>
                setAttributes({
                  ...attributes,
                  number: content,
                })
              }
              placeholder="X"
              className="number"
              allowedFormats={[]}
            />

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
          </div>

          <RichText
            tagName="div"
            value={attributes.text}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                text: content,
              })
            }
            placeholder="Description"
            className="text"
            allowedFormats={[]}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
