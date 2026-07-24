import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "../styles/editor.scss";
import { TwoColumnsColumnBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: TwoColumnsColumnBlock;
  setAttributes: (attributes: TwoColumnsColumnBlock) => void;
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
        <div className="two-columns-column-preview">
          <InnerBlocks
            templateLock={false} // needed to allowe inner blocks since block "two-columns" is in lock all mode
            allowedBlocks={[
              'core/paragraph',
              'core/list',
              'core/list-item',
              'core/image',
              'core/heading',
              'eldora/action',
              'eldora/actions-container',
              'eldora/accordion',
              'eldora/testimonial',
              'eldora/media',
              'eldora/pole-card',
              'eldora/pole-card-container',
              'eldora/headings-description-card',
              'eldora/headings-description-card-container',
              'eldora/image-text-card',
              'eldora/image-text-card-container',
              'eldora/parent-card',
              'eldora/parent-card-container',
              'eldora/intro-title',
              'eldora/intro-title-container',
              'eldora/commitment-card',
              'eldora/commitment-card-container',
            ]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
