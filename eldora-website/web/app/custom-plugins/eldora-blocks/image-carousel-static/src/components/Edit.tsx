import {
  InspectorControls,
  MediaPlaceholder,
  MediaUpload,
  useBlockProps,
} from "@wordpress/block-editor";
import { Button, FocalPointPicker, PanelBody } from "@wordpress/components";
import "../styles/editor.scss";
import { ImageCarouselStaticBlock, FocalPoint } from "../types/block";
import React, { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: ImageCarouselStaticBlock;
  setAttributes: (attributes: ImageCarouselStaticBlock) => void;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  const setFocalPoint = (imageIndex: number, newFocalPoint: FocalPoint) => {
    const newImages = [...(attributes.images || [])];
    if (newImages[imageIndex]) {
      newImages[imageIndex] = {
        ...newImages[imageIndex]!,
        focalPoint: newFocalPoint,
      };
      setAttributes({
        ...attributes,
        images: newImages,
      });
    }
  };

  return (
    <>
      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètres carrousel d'images">
          {/* -- Images -- */}
          <div className="media-container">
            {[0, 1, 2].map((index) => {
              const currentImage = attributes.images?.[index];

              return (
                <div
                  key={index}
                  className="image-carousel-static-preview-image-item"
                >
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
                          focalPoint: {
                            x: 0.5,
                            y: 0.5,
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
                      <FocalPointPicker
                        __nextHasNoMarginBottom
                        url={currentImage.url}
                        value={currentImage.focalPoint}
                        onDragStart={(focalPoint) =>
                          setFocalPoint(index, focalPoint)
                        }
                        onDrag={(focalPoint) =>
                          setFocalPoint(index, focalPoint)
                        }
                        onChange={(focalPoint) =>
                          setFocalPoint(index, focalPoint)
                        }
                      />

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
        <div className="image-carousel-static-preview">
          {/* -- Images -- */}
          <div className="images-area">
            {[0, 1, 2].map((index) => {
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
                        label="Supprimer l'image"
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
                          focalPoint: {
                            x: 0.5,
                            y: 0.5,
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
