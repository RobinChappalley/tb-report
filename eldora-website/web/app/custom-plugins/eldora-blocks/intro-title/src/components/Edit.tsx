import {
  InspectorControls,
  useBlockProps,
  RichText,
  BlockControls,
  URLInput,
} from "@wordpress/block-editor";
import { PanelBody, Popover, TextControl, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import "../styles/editor.scss";
import { IntroTitleBlock } from "../types/block";
import { link } from "@wordpress/icons";
import { useState } from "react";

type Props = {
  clientId: string;
  attributes: IntroTitleBlock;
  setAttributes: (attributes: IntroTitleBlock) => void;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();
  const [showURLPopover, setShowURLPopover] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | undefined>();

  setAttributes({
    ...attributes,
    id: clientId,
  });

  return (
    <>
      {/* -- Toolbar -- */}
      <BlockControls>
        <ToolbarGroup className="button-toolbar">
          <ToolbarButton
            icon={link}
            label="Modifier l'ancre"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setPopoverAnchor(event.currentTarget);
              setShowURLPopover(!showURLPopover);
            }}
            isActive={showURLPopover}
          >
            {attributes.anchor ? "Modifier l'ancre" : "Ajouter une ancre"}
          </ToolbarButton>
        </ToolbarGroup>
      </BlockControls>

      {/* -- URL Popover -- */}
      {showURLPopover && (
        <Popover
          onClose={() => setShowURLPopover(false)}
          focusOnMount={false}
          anchor={popoverAnchor}
        >
          <div className="url-popover popover">
            <URLInput
              value={attributes.anchor}
              onChange={(anchor) => setAttributes({ ...attributes, anchor })}
              autoFocus
              placeholder="mon-ancre"
            />
          </div>
        </Popover>
      )}
      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètres ancres">
          {/* -- Text -- */}
          <label>Texte</label>
          <RichText
            value={attributes.text}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                text: content,
              })
            }
          />

          {/* -- anchor -- */}
          <label>Ancre</label>
          <TextControl
            value={attributes.anchor}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                anchor: content,
              })
            }
            placeholder="#mon-ancre"
            help="L'ancre doit être unique et ne pas contenir d'espace. Veuillez mettre la même ancre sous advanced > HTML anchor sur le titre référent"
          />
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="intro-title-preview">
          <RichText
            tagName="div"
            value={attributes.text}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                text: content,
              })
            }
            placeholder="Texte de l'ancre"
            className="intro-title-text"
            allowedFormats={[]}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
