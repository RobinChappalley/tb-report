import {
  BlockControls,
  InspectorControls,
  MediaPlaceholder,
  MediaUpload,
  RichText,
  URLInput,
  useBlockProps,
} from "@wordpress/block-editor";
import {
  Button,
  PanelBody,
  Popover,
  SelectControl,
  TextControl,
  ToolbarButton,
  ToolbarDropdownMenu,
  ToolbarGroup,
} from "@wordpress/components";
import "../styles/editor.scss";
import { MouseEvent } from "react";
import { Format, TextImageGridBlock } from "../types/block";
import { link, linkOff } from "@wordpress/icons";
import { useEffect, useState } from "react";
import clsx from "clsx";
import React from "react";

type Props = {
  clientId: string;
  attributes: TextImageGridBlock;
  setAttributes: (attributes: TextImageGridBlock) => void;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();
  const [showURLPopover, setShowURLPopover] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<
    HTMLButtonElement | undefined
  >();

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  const formats = [
    { label: "Image à droite", value: "one-image-right" },
    { label: "Image à gauche", value: "one-image-left" },
    { label: "Quatre images", value: "four-images" },
  ];

  return (
    <>
      {/* Toolbar */}
      <BlockControls>
        <ToolbarGroup>
          {/* Format */}
          <ToolbarDropdownMenu
            icon="grid-view"
            label="Choisir le format"
            controls={[
              formats.map((format) => {
                return {
                  title: format.label,
                  isSelected: attributes.format === format.value,
                  onClick: () =>
                    setAttributes({
                      ...attributes,
                      format: format.value as Format,
                    }),
                };
              }),
            ]}
          />

          {/* Link URL */}
          <ToolbarButton
            icon={attributes.link?.url ? link : linkOff}
            label="Modifier l'URL"
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              setPopoverAnchor(event.currentTarget);
              setShowURLPopover((prevState) => !prevState);
            }}
            isActive={showURLPopover}
          >
            URL du lien
          </ToolbarButton>
        </ToolbarGroup>
      </BlockControls>

      {/* URL Popover */}
      {showURLPopover && (
        <Popover
          onClose={() => setShowURLPopover(false)}
          anchor={popoverAnchor}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="url-popover popover"
          >
            <URLInput
              value={attributes.link?.url}
              onChange={(url) =>
                setAttributes({
                  ...attributes,
                  link: {
                    ...attributes.link,
                    url: url,
                  },
                })
              }
              autoFocus
            />
            <div className="popover-help">
              URL complète sur un site externe (par exemple https://example.com)
            </div>
          </div>
        </Popover>
      )}

      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètre grand teaser">
          {/* -- Surtitre -- */}
          <TextControl
            label="Surtitre"
            value={attributes.surtitle}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                surtitle: value,
              })
            }
          />

          {/* -- Titre -- */}
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

          {/* -- Chapô -- */}
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

          {/* -- Texte du lien -- */}
          <TextControl
            label="Texte du lien"
            value={attributes.link?.text || ""}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                link: {
                  ...attributes.link,
                  text: value,
                },
              })
            }
          />

          {/* -- URL du lien -- */}
          <TextControl
            label="URL du lien"
            value={attributes.link?.url || ""}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                link: {
                  ...attributes.link,
                  url: value,
                },
              })
            }
          />

          {/* -- Format -- */}
          <SelectControl
            label="Format"
            value={attributes.format}
            options={formats}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                format: value as Format,
              })
            }
          />

          {/* -- Images -- */}
          <div className="media-container">
            {[0, 1, 2, 3].map((index) => {
              // Skip images 2, 3, 4 if format is not "four-images"
              if (index > 0 && attributes.format !== "four-images") {
                return null;
              }

              const currentImage = attributes.images?.[index];

              return (
                <div key={index} className="text-image-grid-preview-image-item">
                  <label>Image {index + 1}</label>

                  {!currentImage?.url && (
                    <MediaPlaceholder
                      onSelect={(media) => {
                        const newImages = [...(attributes.images || [])];
                        newImages[index] = {
                          url: media.url,
                          alt: media.alt || "",
                          sizes: {
                            medium: media.sizes?.medium?.url || media.url,
                            large: media.sizes?.large?.url || media.url,
                          },
                        };
                        setAttributes({
                          ...attributes,
                          images: newImages,
                        });
                      }}
                      allowedTypes={["image"]}
                    />
                  )}

                  {currentImage?.url && (
                    <>
                      <img src={currentImage.url} />

                      <Button
                        onClick={() => {
                          const newImages = [...(attributes.images || [])];
                          newImages[index] = undefined;
                          setAttributes({
                            ...attributes,
                            images: newImages,
                          });
                        }}
                        className="remove-image-button"
                      >
                        Supprimer l'image {index + 1}
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div
          className={clsx("text-image-grid-preview", {
            reverse: attributes.format === "one-image-left",
          })}
        >
          <div className="texts-area">
            {/* -- Surtitre -- */}
            <RichText
              tagName="div"
              value={attributes.surtitle}
              onChange={(content) =>
                setAttributes({
                  ...attributes,
                  surtitle: content,
                })
              }
              placeholder="Surtitre"
              className="surtitle"
              allowedFormats={[]}
            />

            {/* -- Titre -- */}
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

            {/* -- Chapô -- */}
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

            {/* -- Lien (text) -- */}
            <RichText
              tagName="div"
              value={attributes.link?.text}
              onChange={(content) =>
                setAttributes({
                  ...attributes,
                  link: {
                    ...attributes.link,
                    text: content,
                  },
                })
              }
              placeholder="Texte du lien"
              className="link-text"
              allowedFormats={[]}
            />
          </div>

          {/* -- Images -- */}
          <div className={`images-area format-${attributes.format}`}>
            {[0, 1, 2, 3].map((index) => {
              // Skip images 2, 3, 4 if format is not "four-images"
              if (index > 0 && attributes.format !== "four-images") {
                return null;
              }

              return (
                <React.Fragment key={index}>
                  {/* Image set */}
                  {attributes.images?.[index]?.url && (
                    <div className={`image-container image-${index + 1}`}>
                      <img src={attributes.images?.[index]?.url} />
                      <Button
                        onClick={() => {
                          const newImages = [...(attributes.images || [])];
                          newImages[index] = undefined;
                          setAttributes({
                            ...attributes,
                            images: newImages,
                          });
                        }}
                        className="remove-image-button"
                        icon="no-alt"
                        label="Remove image"
                      />
                    </div>
                  )}

                  {/* No Image */}
                  {!attributes.images?.[index]?.url && (
                    <MediaUpload
                      onSelect={(media) => {
                        const newImages = [...(attributes.images || [])];
                        newImages[index] = {
                          url: media.url,
                          alt: media.alt,
                          sizes: {
                            medium: media.sizes?.medium?.url,
                            large: media.sizes?.large?.url,
                          },
                        };
                        setAttributes({
                          ...attributes,
                          images: newImages,
                        });
                      }}
                      allowedTypes={["image"]}
                      render={({ open }) => (
                        <Button
                          onClick={open}
                          className={`add-image-button add-image-${index + 1}`}
                          variant="secondary"
                        >
                          <span className="dashicons dashicons-plus-alt"></span>
                          Ajouter une image
                        </Button>
                      )}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
