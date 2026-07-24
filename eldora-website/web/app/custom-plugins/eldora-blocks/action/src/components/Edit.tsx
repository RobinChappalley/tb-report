import {
  BlockControls,
  InspectorControls,
  RichText,
  useBlockProps,
  URLInput,
  MediaUpload,
} from "@wordpress/block-editor";
import {
  PanelBody,
  TextControl,
  ToggleControl,
  ToolbarButton,
  ToolbarGroup,
  Popover,
  SelectControl,
  Button,
} from "@wordpress/components";
import "../styles/editor.scss";
import { link, linkOff, external, download } from "@wordpress/icons";
import { ActionBlock } from "../types/block";
import { MouseEvent, useEffect, useState } from "react";

type Props = {
  clientId: string;
  attributes: ActionBlock;
  setAttributes: (attributes: ActionBlock) => void;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  const [showURLPopover, setShowURLPopover] = useState(false);
  const [popoverAnchor, setPopoverAnchor] = useState<
    HTMLButtonElement | undefined
  >();

  const types = [
    {
      label: "Lien",
      value: "link",
    },
    {
      label: "Fichier",
      value: "file",
    },
  ];

  const icons = [
    {
      label: "Aucun",
      value: "",
    },
    {
      label: "Fléche à droite",
      value: "full-arrow-right",
    },
    {
      label: "Téléchargement",
      value: "sim-card",
    },
  ];

  return (
    <>
      {/* Toolbar */}
      <BlockControls>
        <ToolbarGroup>
          {/* Type */}
          <ToolbarButton
            icon={attributes.type === "link" ? download : link}
            onClick={() => {
              setAttributes({
                ...attributes,
                type: attributes.type === "link" ? "file" : "link",
              });
            }}
          >
            {attributes.type === "link"
              ? "Transformé en fichier"
              : "Transformé en lien"}
          </ToolbarButton>

          {attributes.type === "link" && (
            <>
              {/* Link URL */}
              <ToolbarButton
                icon={attributes.link ? link : linkOff}
                label="Modifier l'URL"
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  setPopoverAnchor(event.currentTarget);
                  setShowURLPopover((prevState) => !prevState);
                }}
                isActive={showURLPopover}
              >
                URL du lien
              </ToolbarButton>

              {/* Link Blank */}
              <ToolbarButton
                icon={external}
                onClick={() => {
                  setAttributes({
                    ...attributes,
                    isBlank: !attributes.isBlank,
                  });
                }}
              >
                {attributes.isBlank
                  ? "Ne pas ouvrir dans un nouvel onglet"
                  : "Ouvrir dans un nouvel onglet"}
              </ToolbarButton>
            </>
          )}
        </ToolbarGroup>
      </BlockControls>

      {/* URL Popover */}
      {showURLPopover && attributes.type === "link" && (
        <Popover
          onClose={() => setShowURLPopover(false)}
          anchor={popoverAnchor}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="url-popover popover"
          >
            <URLInput
              value={attributes.link}
              onChange={(url: string) =>
                setAttributes({
                  ...attributes,
                  link: url,
                })
              }
              autoFocus
            />
          </div>
        </Popover>
      )}

      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètre action">
          {/* -- Type -- */}
          <SelectControl
            label="Type"
            value={attributes.type}
            options={types}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                type: value as "link" | "file",
              })
            }
          />

          {/* -- Label -- */}
          <TextControl
            label="Texte"
            value={attributes.label}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                label: value,
              })
            }
          />

          {/* -- Left Icon -- */}
          <SelectControl
            label="Icône à gauche"
            value={attributes.iconLeft}
            options={icons}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                iconLeft: value as string,
              })
            }
          />

          {/* -- Right Icon -- */}
          <SelectControl
            label="Icône à droite"
            value={attributes.iconRight}
            options={icons}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                iconRight: value as string,
              })
            }
          />

          {attributes.type === "link" && (
            <>
              {/* -- URL du lien -- */}
              <TextControl
                label="URL du lien"
                value={attributes.link || ""}
                onChange={(value) =>
                  setAttributes({
                    ...attributes,
                    link: value,
                  })
                }
              />

              {/* -- Is Blank -- */}
              <ToggleControl
                label="Ouvrir dans un nouvel onglet"
                checked={attributes.isBlank}
                onChange={(value) =>
                  setAttributes({
                    ...attributes,
                    isBlank: value,
                  })
                }
                help="Si activé, s'ouvrira dans un nouvel onglet"
              />
            </>
          )}

          {attributes.type === "file" && (
            <div>
              {attributes.file && (
                <>
                  <div>
                    Fichier :{" "}
                    <a
                      href={attributes.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {attributes.file.split("/").pop()}
                    </a>
                  </div>

                  <Button
                    className="red-link-button"
                    onClick={() =>
                      setAttributes({
                        ...attributes,
                        file: "",
                      })
                    }
                  >
                    Supprimer le fichier
                  </Button>
                </>
              )}
            </div>
          )}
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="action-preview">
          {/* Show file upload if type is file and no file set */}
          {!attributes.file && attributes.type === "file" && (
            <MediaUpload
              onSelect={(media) =>
                setAttributes({
                  ...attributes,
                  file: media.url,
                })
              }
              render={({ open }) => (
                <Button
                  onClick={open}
                  className="add-image-button"
                  variant="secondary"
                >
                  <span className="dashicons dashicons-download"></span>
                  Télécharger un fichier
                </Button>
              )}
            />
          )}

          {/* Show preview if type is file and file set OR if type is link */}
          {((attributes.file && attributes.type === "file") ||
            attributes.type === "link") && (
            <>
              {attributes.iconLeft && (
                <svg className="icon">
                  <use
                    xlinkHref={`/app/themes/eldora-theme/assets/icons/icons.svg#${attributes.iconLeft}`}
                  />
                </svg>
              )}
              <RichText
                tagName="div"
                value={attributes.label}
                onChange={(content) =>
                  setAttributes({
                    ...attributes,
                    label: content,
                  })
                }
                placeholder="Texte"
                className="label"
                allowedFormats={[]}
              />
              {attributes.iconRight && (
                <svg className="icon">
                  <use
                    xlinkHref={`/app/themes/eldora-theme/assets/icons/icons.svg#${attributes.iconRight}`}
                  />
                </svg>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Edit;
