import { InspectorControls, useBlockProps } from "@wordpress/block-editor";
import { select, useSelect } from "@wordpress/data";
import { PanelBody, SelectControl } from "@wordpress/components";
import "../styles/editor.scss";
import { TestimonialBlock } from "../types/block";
import { store } from "@wordpress/core-data";
import { useEffect, useState } from "react";

type Props = {
  clientId: string;
  attributes: TestimonialBlock;
  setAttributes: (attributes: TestimonialBlock) => void;
};

type Option = {
  label: string;
  value: string;
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();

  const [testimonialsOptions, setTestimonialsOptions] = useState<Option[]>([]);

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  // Get all testimonials posts
  const testimonials = useSelect(
    (select) =>
      select(store).getEntityRecords("postType", "testimonials", {
        per_page: -1,
        status: "publish",
      }) || [],
    [],
  );

  // Convert testimonials posts to options
  useEffect(() => {
    if (testimonials.length > 0) {
      setTestimonialsOptions([
        {
          label: "Sélectionner un témoignage",
          value: "",
        },
        ...testimonials
          .map((testimonial: any) => ({
            label: testimonial.title.rendered,
            value: String(testimonial.id),
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      ]);
    }
  }, [testimonials]);

  // On testimonialId change or on page load, set attributes with the testimonial data
  useEffect(() => {
    const selectedTestimonial = testimonials.find(
      (testimonial: any) => testimonial.id === Number(attributes.testimonialId),
    ) as any;

    setAttributes({
      ...attributes,
      name: selectedTestimonial?.acf?.name,
      jobCompany: selectedTestimonial?.acf?.job_company,
      testimonial: selectedTestimonial?.acf?.testimonial,
    });
  }, [attributes.testimonialId, testimonialsOptions]);

  return (
    <>
      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètres témoignage">
          <SelectControl
            __nextHasNoMarginBottom
            label="Témoignage"
            value={String(attributes.testimonialId)}
            options={testimonialsOptions}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                testimonialId: value ? Number(value) : undefined,
              })
            }
          />
        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="testimonial-preview">
          {!attributes.testimonial && (
            <div className="no-selected-testimonial">
              Veuillez sélectionner un témoignage
            </div>
          )}

          {attributes.testimonial && (
            <>
              <div className="testimonial">“{attributes.testimonial}”</div>
              <div className="author">
                {attributes.name} {attributes.jobCompany}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Edit;
