import { PoleCardBlock } from "../types/block";
import { useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: PoleCardBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `pole-card-${attributes.id}`,
    className: "pole-card",
  });

  return (
    <div {...blockProps}>
      <a href={attributes.link} className="pole-card-link">
        <img className="pole-logo" src={`/app/themes/eldora-theme/assets/images/logo-${attributes.logo}.svg`} alt={attributes.logo} />
        {attributes.text && <div className="text">{attributes.text}</div>}
        <div className="pole-arrow">
          <svg className="icon">
            <use xlinkHref={`/app/themes/eldora-theme/assets/icons/icons.svg#arrow-right`} />
          </svg>
        </div>
      </a>
    </div>
  );
};

export default Save;
