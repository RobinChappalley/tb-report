import {
  BlockControls,
  InspectorControls,
  MediaPlaceholder,
  MediaUpload,
  URLInput,
  useBlockProps,
} from "@wordpress/block-editor";
import {
  Button,
  FocalPointPicker,
  PanelBody,
  Popover,
  SelectControl,
  TextControl,
  ToolbarButton,
  ToolbarDropdownMenu,
  ToolbarGroup,
} from "@wordpress/components";
import { link, linkOff } from "@wordpress/icons";
import { MouseEvent, useEffect } from "react";
import "../styles/editor.scss";
import { Direction, FullScreenImageBlock, Points } from "../types/block";
import { useState } from "@wordpress/element";

type Props = {
  clientId: string;
  attributes: FullScreenImageBlock;
  setAttributes: (attributes: FullScreenImageBlock) => void;
};

const convertYoutubeUrl = (url: string): string => {
  if (!url) return "";

  // Match YouTube video ID and si parameter from various URL formats
  const patterns = [
    /youtube\.com\/watch\?v=([^\&\?\/]+)/, // Standard YouTube URL
    /youtube\.com\/shorts\/([^\&\?\/]+)/, // Short YouTube URL
    /youtu\.be\/([^\&\?\/]+)/, // Shortened YouTube URL
    /youtube\.com\/embed\/([^\&\?\/]+)/, // Already an embed URL
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const videoId = match[1];

      // Try to extract si parameter if it exists
      const siMatch = url.match(/[?&]si=([^&]+)/);
      const si = siMatch ? siMatch[1] : "";

      // Construct embed URL
      let embedUrl = `https://www.youtube.com/embed/${videoId}`;

      // Add parameters
      const params = [];
      if (si) params.push(`si=${si}`);
      params.push("modestbranding=1");
      params.push("showinfo=0");
      params.push("rel=0");
      params.push("autoplay=0");

      return `${embedUrl}?${params.join("&")}`;
    }
  }

  return url;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();
  const [showURLPopover, setShowURLPopover] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<
    HTMLButtonElement | undefined
  >();
  const directions = [
    { label: "Haut", value: "up" },
    { label: "Bas", value: "down" },
    { label: "Gauche", value: "left" },
    { label: "Droite", value: "right" },
  ];

  const setFocalPoint = (newFocalPoint: Points) => {
    setAttributes({
      ...attributes,
      focalPoint: newFocalPoint,
    });
  };

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  return (
    <>
      {/* Toolbar */}
      <BlockControls>
        <ToolbarButton
          icon={attributes.videoUrl ? link : linkOff}
          label="Modifier l'URL"
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            setPopoverAnchor(event.currentTarget);
            setShowURLPopover((prevState) => !prevState);
          }}
          isActive={showURLPopover}
        >
          {attributes.videoUrl ? "Modifier l'URL" : "Ajouter l'URL"}
        </ToolbarButton>
        <ToolbarGroup>
          <ToolbarDropdownMenu
            icon="tide"
            label="Sélectionner dégradé"
            controls={[
              directions.map((direction) => {
                return {
                  title: direction.label,
                  isSelected: attributes.gradientDirection === direction.value,
                  onClick: () =>
                    setAttributes({
                      ...attributes,
                      gradientDirection: direction.value as Direction,
                    }),
                };
              }),
            ]}
          />
        </ToolbarGroup>
      </BlockControls>

      {/* videoUrl Popover */}
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
              value={attributes.videoUrl}
              onChange={(videoUrl) =>
                setAttributes({
                  ...attributes,
                  videoUrl: convertYoutubeUrl(videoUrl),
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
        <PanelBody title="Paramètres de Grande image / Grande vidéo">
          {/* -- Image -- */}
          <label>Image</label>
          {/* Image not set */}
          {!attributes.imageUrl && (
            <MediaPlaceholder
              onSelect={(media) => {
                setAttributes({
                  ...attributes,
                  imageUrl: media.url,
                  imageAlt: media.alt,
                  mediaSizes: {
                    medium: media.sizes?.medium?.url,
                    large: media.sizes?.large?.url,
                  },
                });
              }}
              allowedTypes={["image"]}
            />
          )}
          {/* Image set */}
          {attributes.imageUrl && (
            <div className="media-container">
              <FocalPointPicker
                __nextHasNoMarginBottom
                url={attributes.imageUrl}
                value={attributes.focalPoint}
                onDragStart={setFocalPoint}
                onDrag={setFocalPoint}
                onChange={setFocalPoint}
              />
              <Button
                onClick={() =>
                  setAttributes({
                    ...attributes,
                    imageUrl: "",
                    imageAlt: "",
                    mediaSizes: undefined,
                  })
                }
                className="remove-image-button"
              >
                Supprimer l'image
              </Button>
            </div>
          )}

          {/* VideoURL */}
          <TextControl
            label="Video"
            value={attributes.videoUrl || ""}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                videoUrl: convertYoutubeUrl(value),
              })
            }
            help="Entrez une URL dans un fichier vidéo ou laissez vide pour utiliser uniquement l'image"
          />
          {attributes.videoUrl && (
            <iframe
              className="full-screen-image-sidebar-iframe"
              src={convertYoutubeUrl(attributes.videoUrl)}
            ></iframe>
          )}

          {/* Gradient Direction */}
          <SelectControl
            label="Dégradé"
            value={attributes.gradientDirection}
            options={directions}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                gradientDirection: value as Direction,
              })
            }
          />
        </PanelBody>
      </InspectorControls>

      {/* Preview */}
      <div {...blockProps}>
        <div className="full-screen-image-preview">
          {!attributes.imageUrl && !attributes.videoUrl && (
            <MediaUpload
              onSelect={(media) => {
                setAttributes({
                  ...attributes,
                  imageUrl: media.url,
                  imageAlt: media.alt,
                  mediaSizes: {
                    medium: media.sizes?.medium?.url,
                    large: media.sizes?.large?.url,
                  },
                });
              }}
              allowedTypes={["image"]}
              render={({ open }) => (
                <Button
                  onClick={open}
                  className="add-image-button"
                  variant="secondary"
                  label="Ajouter une image"
                >
                  Ajouter une image
                </Button>
              )}
            />
          )}
          {attributes.imageUrl && !attributes.videoUrl && (
            <div
              className={`image-container gradient gradient-direction-${attributes.gradientDirection}`}
            >
              <picture>
                <source
                  media="(max-width: 720px)"
                  srcSet={attributes.mediaSizes?.large}
                />
                <img
                  className="image"
                  src={attributes.imageUrl}
                  alt={attributes.imageAlt}
                />
              </picture>
              <Button
                onClick={() =>
                  setAttributes({
                    ...attributes,
                    imageUrl: "",
                    imageAlt: "",
                  })
                }
                className="remove-image-button"
                icon="no-alt"
                label="Supprimer l'image"
              />
            </div>
          )}

          {attributes.videoUrl && (
            <div className="video-container">
              <iframe
                src={`${convertYoutubeUrl(
                  attributes.videoUrl,
                )}&autoplay=0&mute=1`}
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Edit;
