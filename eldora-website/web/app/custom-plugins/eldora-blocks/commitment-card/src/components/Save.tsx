import { CommitmentCardBlock } from "../types/block";
import { useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: CommitmentCardBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `commitment-card-${attributes.id}`,
    className: "commitment-card",
  });

  return (
    <div {...blockProps}>
      <a target={attributes.isExternal ? "_blank" : "_self"} rel={attributes.isExternal ? "noopener noreferrer" : ""} href={attributes.link} className="commitment-card-link">
        <div>
          <div className="header-title">{attributes.headerTitle}</div>
          <div className="title">{attributes.title}</div>
        </div>
        <div className="description">{attributes.description}</div>
        <div className="commitment-card-arrow">
          <svg className="icon">
            <use xlinkHref={`/app/themes/eldora-theme/assets/icons/icons.svg#arrow-right`} />
          </svg>
        </div>
      </a>
    </div>
  );
};

export default Save;
