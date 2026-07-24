import {
  BlockControls,
  InspectorControls,
  RichText,
  useBlockProps,
} from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";
import "../styles/editor.scss";
import { ImageMetricsNumberBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: ImageMetricsNumberBlock;
  setAttributes: (attributes: ImageMetricsNumberBlock) => void;
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
        <PanelBody title="Paramètre chiffre clé">
          {/* -- Number -- */}
          <TextControl
            label="Chiffre"
            value={attributes.number}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                number: value,
              })
            }
          />

          {/* -- Legend -- */}
          <TextControl
            label="Légende"
            value={attributes.legend}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                legend: value,
              })
            }
          />
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="image-metrics-number-preview">
          <RichText
            tagName="div"
            value={attributes.number}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                number: content,
              })
            }
            placeholder="Chiffre"
            className="number"
            allowedFormats={[]}
          />

          <RichText
            tagName="div"
            value={attributes.legend}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                legend: content,
              })
            }
            placeholder="Légende"
            className="legend"
            allowedFormats={[]}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
