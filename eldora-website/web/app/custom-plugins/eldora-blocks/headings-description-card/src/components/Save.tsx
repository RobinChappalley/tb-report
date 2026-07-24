import { HeadingsDescriptionCardBlock } from "../types/block";
import { useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: HeadingsDescriptionCardBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `headings-description-card-${attributes.id}`,
    className: "headings-description-card",
  });

  return (
    <div {...blockProps}>
      <a target={attributes.isExternal ? "_blank" : "_self"} rel={attributes.isExternal ? "noopener noreferrer" : ""} href={attributes.link} className="headings-description-card-link">
        <div className="title">{attributes.title}</div>
        <div className="description">{attributes.description}</div>
        <div className="headings-description-card-arrow">
          <svg className="icon">
            <use xlinkHref={`/app/themes/eldora-theme/assets/icons/icons.svg#arrow-right`} />
          </svg>
        </div>
      </a>
    </div>
  );
};

export default Save;
