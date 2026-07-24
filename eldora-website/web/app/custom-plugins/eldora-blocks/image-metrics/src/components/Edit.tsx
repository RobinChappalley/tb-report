import {
  BlockControls,
  InnerBlocks,
  InspectorControls,
  MediaPlaceholder,
  MediaUpload,
  useBlockProps,
} from "@wordpress/block-editor";
import {
  Button,
  FocalPointPicker,
  PanelBody,
  SelectControl,
  ToolbarDropdownMenu,
  ToolbarGroup,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import "../styles/editor.scss";
import { Direction, FocalPoint, ImageMetricsBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: ImageMetricsBlock;
  setAttributes: (attributes: ImageMetricsBlock) => void;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  const directions = [
    { label: "Gauche", value: "left" },
    { label: "Droite", value: "right" },
  ];

  const innerBlocks = useSelect(
    (select) => (select("core/block-editor") as any).getBlocks(clientId),
    [clientId],
  );

  const setFocalPoint = (newFocalPoint: FocalPoint) => {
    setAttributes({
      ...attributes,
      focalPoint: newFocalPoint,
    });
  };

  return (
    <>
      {/* Toolbar */}
      <BlockControls>
        <ToolbarGroup>
          <ToolbarDropdownMenu
            icon="tide"
            label="Choisir la direction du gradient"
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

      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètre chiffre clé">
          {/* -- Image -- */}
          <label>Image</label>
          <div className="media-container">
            {/* Image not set */}
            {!attributes.imageUrl && (
              <MediaPlaceholder
                onSelect={(media) => {
                  setAttributes({
                    ...attributes,
                    imageUrl: media.url,
                    imageAlt: media.alt,
                    imageSizes: {
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
              <>
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
                      imageSizes: undefined,
                    })
                  }
                  className="remove-image-button"
                >
                  Remove Image
                </Button>
              </>
            )}
          </div>

          {/* Gradient Direction */}
          <SelectControl
            label="Direction du gradient"
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

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="image-metrics-preview">
          {!attributes.imageUrl && (
            <MediaUpload
              onSelect={(media) =>
                setAttributes({
                  ...attributes,
                  imageUrl: media.url,
                  imageAlt: media.alt,
                  imageSizes: {
                    medium: media.sizes?.medium?.url,
                    large: media.sizes?.large?.url,
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
                  Ajouter une image
                </Button>
              )}
            />
          )}
          {attributes.imageUrl && (
            <>
              <div
                className={`image-container gradient-direction-${attributes.gradientDirection}`}
              >
                <img
                  className="image"
                  src={attributes.imageUrl}
                  alt={attributes.imageAlt}
                />
                <Button
                  onClick={() =>
                    setAttributes({
                      ...attributes,
                      imageUrl: "",
                      imageAlt: "",
                      imageSizes: undefined,
                    })
                  }
                  className="remove-image-button"
                  icon="no-alt"
                  label="Remove image"
                />
              </div>

              <div
                className={`image-metrics-number-container gradient-align-${attributes.gradientDirection}`}
              >
                <InnerBlocks
                  allowedBlocks={["eldora/image-metrics-number"]}
                  // button to add new child block
                  renderAppender={() =>
                    innerBlocks.length < 4 ? (
                      <InnerBlocks.ButtonBlockAppender />
                    ) : (
                      false
                    )
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Edit;
