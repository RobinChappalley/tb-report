import {
  InnerBlocks,
  InspectorControls,
  useBlockProps,
  RichText,
  BlockControls,
  URLInput,
} from "@wordpress/block-editor";
import { PanelBody, Popover, SelectControl, TextControl, ToggleControl, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import "../styles/editor.scss";
import { HeadingsDescriptionCardBlock } from "../types/block";
import { useEffect, useState } from "react";
import { link, linkOff, external } from "@wordpress/icons";

type Props = {
  clientId: string;
  attributes: HeadingsDescriptionCardBlock;
  setAttributes: (attributes: HeadingsDescriptionCardBlock) => void;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();
  const [showURLPopover, setShowURLPopover] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<HTMLButtonElement | undefined>();

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  return (
    <>
      {/* -- Toolbar -- */}
      <BlockControls>
        <ToolbarGroup className="button-toolbar">
          <ToolbarButton
            icon={attributes.isExternal ? external : null}
            label={attributes.isExternal ? "Lien externe" : "Lien interne"}
            isActive={attributes.isExternal}
            onClick={() => setAttributes({ ...attributes, isExternal: !attributes.isExternal })}
          >
            {attributes.isExternal ? "Lien externe" : "Lien interne"}
          </ToolbarButton>
          <ToolbarButton
            icon={attributes.link ? link : linkOff}
            label="Modifier le lien"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
              setPopoverAnchor(event.currentTarget);
              setShowURLPopover(!showURLPopover);
            }}
            isActive={showURLPopover}
          >
            {attributes.link ? "Modifier le lien" : "Ajouter un lien"}
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
              value={attributes.link}
              onChange={(link) => setAttributes({ ...attributes, link })}
              autoFocus
            />
            <div className="popover-help">
              {attributes.isExternal
                ? "URL externe (ex: https://example.com)"
                : "URL interne (ex: /ma-page)"}
            </div>
          </div>
        </Popover>
      )}

      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètres titre et description">
          {/* -- Title -- */}
          <TextControl
            label="Titre"
            value={attributes.title}
            onChange={(value) =>
              setAttributes({ ...attributes, title: value })
            }
          >
          </TextControl>

          {/* -- Text -- */}
          <label>Description</label>
          <RichText
            value={attributes.description}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                description: content,
              })
            }
          />

          {/* -- link -- */}
          <label>Lien</label>
          <TextControl
            label={attributes.isExternal ? "URL externe" : "URL interne"}
            value={attributes.link}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                link: content,
              })
            }
            placeholder={
              attributes.isExternal 
                ? "https://example.com" 
                : "/my-page"
            }
            help={
              attributes.isExternal
                ? "URL externe (ex: https://example.com)"
                : "URL interne (ex: /ma-page)"
            }
          />
          <ToggleControl
            label="Lien externe"
            checked={attributes.isExternal}
            onChange={() => setAttributes({ ...attributes, isExternal: !attributes.isExternal })}
            help={
              attributes.isExternal
                ? "Le lien s'ouvrira dans un nouvel onglet"
                : "Le lien s'ouvrira dans le même onglet"
            }
          />
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="headings-description-card-preview">
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
            value={attributes.description}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                description: content,
              })
            }
            placeholder="Description"
            className="description"
            allowedFormats={[]}
          />
          <div className="headings-description-card-arrow">
            <svg className="icon">
              <use
                xlinkHref={`/app/themes/eldora-theme/assets/icons/icons.svg#arrow-right`}
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
