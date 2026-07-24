import {
  InspectorControls,
  useBlockProps,
  RichText,
  BlockControls,
  URLInput,
  MediaPlaceholder,
  MediaUpload,
} from "@wordpress/block-editor";
import { Button, PanelBody, Popover, TextControl, ToolbarButton, ToolbarGroup } from "@wordpress/components";
import "../styles/editor.scss";
import { ImageTextCardBlock } from "../types/block";
import { link, linkOff } from "@wordpress/icons";
import { useEffect, useState } from "react";

type Props = {
  clientId: string;
  attributes: ImageTextCardBlock;
  setAttributes: (attributes: ImageTextCardBlock) => void;
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
              URL de la carte
            </div>
          </div>
        </Popover>
      )}

      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètres carte image et texte">
          {/* -- Image -- */}
          <label>Image</label>
          {/* Image not set */}
          {!attributes.image && (
            <MediaPlaceholder
              onSelect={(media) => {
                setAttributes({
                  ...attributes,
                  image: media.url,
                  imageAlt: media.alt,
                  imageSize: {
                    thumbnail: media.sizes?.thumbnail?.url,
                    medium: media.sizes?.medium?.url,
                    large: media.sizes?.large?.url,
                    full: media.url,
                  },
                });
              }}
              allowedTypes={["image"]}
            />
          )}
          {/* Image set */}
          {attributes.image && (
            <div className="media-container">
              <img src={attributes.image} />
              <Button
                onClick={() =>
                  setAttributes({
                    ...attributes,
                    image: "",
                    imageAlt: ""
                  })
                }
                className="remove-image-button"
              >
                Supprimer l'image
              </Button>
            </div>
          )}

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

          {/* -- Link -- */}
          <TextControl
            label="Lien"
            value={attributes.link}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                link: value,
              })
            }
            placeholder="/ma-page"
          />

          {/* -- Link Text -- */}
          <TextControl
            label="Texte du lien"
            value={attributes.linkText}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                linkText: value,
              })
            }
            placeholder="Texte du lien"
          />
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="image-text-card-preview">
          {!attributes.image && (
            <MediaUpload
              onSelect={(media) =>
                setAttributes({
                  ...attributes,
                  image: media.url,
                  imageAlt: media.alt,
                  imageSize: {
                    thumbnail: media.sizes?.thumbnail?.url,
                    medium: media.sizes?.medium?.url,
                    large: media.sizes?.large?.url,
                    full: media.url,
                  },
                })
              }
              allowedTypes={["image"]}
              render={({ open }) => (
                <Button
                  onClick={open}
                  className="add-image-button"
                  variant="secondary"
                >
                  <span className="dashicons dashicons-plus-alt"></span>
                  Add Image
                </Button>
              )}
            />
          )}
          {attributes.image && (
            <div className="image-container">
              <img className="image" src={attributes.image} alt={attributes.imageAlt} />
              <Button
                onClick={() =>
                  setAttributes({
                    ...attributes,
                    image: "",
                    imageAlt: "",
                  })
                }
                className="remove-image-button"
                icon="no-alt"
                label="Remove image"
              />
            </div>
          )}
          
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
            placeholder="Description"
            className="text"
            allowedFormats={[]}
          />

          <RichText
            tagName="div"
            value={attributes.linkText}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                linkText: content,
              })
            }
            placeholder="Texte du lien"
            className="link-text"
            allowedFormats={[]}
          />
        </div>
      </div>
    </>
  );
};

export default Edit;
