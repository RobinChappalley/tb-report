import {
  InnerBlocks,
  InspectorControls,
  useBlockProps,
  RichText,
} from "@wordpress/block-editor";
import { PanelBody, SelectControl, TextControl } from "@wordpress/components";
import "../styles/editor.scss";
import { PoleCardBlock } from "../types/block";
import { useEffect } from "react";

type Props = {
  clientId: string;
  attributes: PoleCardBlock;
  setAttributes: (attributes: PoleCardBlock) => void;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  return (
    <>
      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètres carte pôle">
          {/* -- Logo -- */}
          <SelectControl
            label="Logo"
            value={attributes.logo}
            options={[
              { label: "École", value: "school-fr" },
              { label: "Entreprise", value: "entreprise-fr" },
              { label: "Santé", value: "health-fr" },
              { label: "Enseignement", value: "education-fr" },
              { label: "School", value: "school-de" },
              { label: "Business", value: "entreprise-de" },
              { label: "Healthcare", value: "health-de" },
              { label: "Campus", value: "education-de" },
            ]}
            onChange={(value) =>
              setAttributes({ ...attributes, logo: value })
            }
          >
          </SelectControl>

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

          {/* -- link -- */}
          <label>Lien</label>
          <TextControl
            value={attributes.link}
            onChange={(content) =>
              setAttributes({
                ...attributes,
                link: content,
              })
            }
            placeholder="/ma-page"
          />
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="pole-card-preview">
          <img className="pole-logo" src={`/app/themes/eldora-theme/assets/images/logo-${attributes.logo}.svg`} alt={attributes.logo} />
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
          <div className="pole-arrow">
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
