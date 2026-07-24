import { AccordionBlock } from "../types/block";
import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

type Props = {
  attributes: AccordionBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `eldora-accordion-${attributes.id}`,
    className: `accordion`,
    "x-data": "{ open: false }",
    ":class": "open && 'open'",
  });

  if (attributes.title === "") {
    return <></>;
  }

  return (
    <div {...blockProps}>
      <button
        className="header-area"
        type="button"
        aria-expanded="false"
        {...{ "x-bind:aria-expanded": "open" }}
        {...{ "@click": `open = !open` }}
      >
        <div>
          <div className="title h7">{attributes.title}</div>
          <div className="subtitle h7">{attributes.subtitle}</div>
        </div>
        <svg className="icon">
          <use xlinkHref="/app/themes/eldora-theme/assets/icons/icons.svg#plus" />
        </svg>
      </button>
      <div className="inner-blocks-area" x-show="open" x-cloak="" x-collapse="">
        <InnerBlocks.Content />
      </div>
    </div>
  );
};

export default Save;
