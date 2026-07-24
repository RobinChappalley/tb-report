import { TestimonialsSliderBlock } from "../types/block";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: TestimonialsSliderBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `testimonials-slider-${attributes.id}`,
    className: "testimonials-slider",
  });

  return (
    <div {...blockProps}>
      <h4 className="title h4">{attributes.title}</h4>
      <div className="embla-testimonials-slider">
        <div className="embla__viewport">
          <div className="testimonials-container embla__container">
            <InnerBlocks.Content />
          </div>
        </div>
        <div className="navigation">
          <button className="embla__prev">
            <svg className="icon">
              <use xlinkHref="/app/themes/eldora-theme/assets/icons/icons.svg#arrow-left" />
            </svg>
          </button>
          <button className="embla__next">
            <svg className="icon">
              <use xlinkHref="/app/themes/eldora-theme/assets/icons/icons.svg#arrow-right" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Save;
