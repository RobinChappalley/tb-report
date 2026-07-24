import {
  InnerBlocks,
  InspectorControls,
  useBlockProps,
  RichText,
} from "@wordpress/block-editor";
import { PanelBody, TextControl } from "@wordpress/components";
import "../styles/editor.scss";
import { NumberedCardsContainerBlock } from "../types/block";
import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

type Props = {
  clientId: string;
  attributes: NumberedCardsContainerBlock;
  setAttributes: (attributes: NumberedCardsContainerBlock) => void;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  const innerBlocks = useSelect(
    (select) => (select("core/block-editor") as any).getBlocks(clientId),
    [clientId],
  );

  useEffect(() => {
    if (innerBlocks) {
      setAttributes({
        ...attributes,
        countCardsHidden: innerBlocks.length - 3,
      });
    }
  }, [innerBlocks]);

  return (
    <>
      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètres cartes numérotées">
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
          <TextControl
            label="Chapô"
            value={attributes.text}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                text: value,
              })
            }
          />
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="numbered-cards-container-preview">
          <div className="titre-text-container">
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
              value={attributes.text}
              onChange={(content) =>
                setAttributes({
                  ...attributes,
                  text: content,
                })
              }
              placeholder="Chapô"
              className="text"
              allowedFormats={[]}
            />
          </div>

          <InnerBlocks
            allowedBlocks={["eldora/numbered-card"]}
            renderAppender={() => <InnerBlocks.ButtonBlockAppender />}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
