import { IntroTitleBlock } from "../types/block";
import { useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: IntroTitleBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `intro-title-${attributes.id}`,
    className: "intro-title",
  });

  return (
    <div {...blockProps}>
      <a 
        href={`#${attributes.anchor}`} 
        data-anchor={attributes.anchor}
        className="intro-title-link"
        {...{ "x-on:click": `
          $el.closest('.intro-title-container-links').querySelectorAll('.intro-title').forEach(link => link.classList.remove('is_active'));
          $el.closest('.intro-title').classList.add('is_active');
        ` }}
      >
        {attributes.text && <div className="intro-title-text">{attributes.text}</div>}
      </a>
    </div>
  );
};

export default Save;