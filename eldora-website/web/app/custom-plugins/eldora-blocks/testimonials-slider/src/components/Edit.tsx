import {
  InnerBlocks,
  InspectorControls,
  RichText,
  useBlockProps,
} from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";
import "../styles/editor.scss";
import { TestimonialsSliderBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: TestimonialsSliderBlock;
  setAttributes: (attributes: TestimonialsSliderBlock) => void;
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
        <PanelBody title="Paramètre grand teaser">
          <TextControl
            label="Titre"
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
        <div className="testimonials-slider-preview">
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
          <InnerBlocks
            allowedBlocks={["eldora/testimonial"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
