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
  PanelBody,
  Popover,
  TextControl,
  ToolbarButton,
} from "@wordpress/components";
import { link } from "@wordpress/icons";
import { MouseEvent, useEffect } from "react";
import "../styles/editor.scss";
import { MediaBlock } from "../types/block";
import { useState } from "@wordpress/element";

type Props = {
  clientId: string;
  attributes: MediaBlock;
  setAttributes: (attributes: MediaBlock) => void;
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
          icon={link}
          label="Modifier la vidéo Youtube"
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            setPopoverAnchor(event.currentTarget);
            setShowURLPopover((prevState) => !prevState);
          }}
          isActive={showURLPopover}
        >
          {attributes.videoUrl
            ? "Modifier la vidéo Youtube"
            : "Ajouter une vidéo Youtube"}
        </ToolbarButton>
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
              Entrez une URL youtube ou laissez vide pour utiliser uniquement
              l'image
            </div>
          </div>
        </Popover>
      )}

      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètres de média">
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
              <img src={attributes.imageUrl} alt={attributes.imageAlt} />
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

          {/* Video URL */}
          <TextControl
            label="Video"
            value={attributes.videoUrl}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                videoUrl: convertYoutubeUrl(value),
              })
            }
            help="Entrez une URL youtube ou laissez vide pour utiliser uniquement l'image"
          />
          {attributes.videoUrl && (
            <iframe
              className="media-preview-inspector-control"
              src={convertYoutubeUrl(attributes.videoUrl)}
            ></iframe>
          )}
        </PanelBody>
      </InspectorControls>

      {/* Preview */}
      <div {...blockProps}>
        <div className="media-preview">
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
            <div className="image-container">
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
                    mediaSizes: undefined,
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
