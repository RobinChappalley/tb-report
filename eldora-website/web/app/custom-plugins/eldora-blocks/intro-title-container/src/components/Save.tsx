import { IntroTitleContainerBlock } from "../types/block";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";

type Props = {
  attributes: IntroTitleContainerBlock;
};

const Save = ({ attributes }: Props): JSX.Element => {
  const blockProps = useBlockProps.save({
    id: `intro-title-container-${attributes.id}`,
    className: "intro-title-container",
  });

  return (
    <div {...blockProps}>
      <div className="intro-title-container-title">
        {attributes.title}
      </div>
      <div 
        className="intro-title-container-links"
        {...{ "x-data": "{}" }}
        {...{ "x-init": `
          // $nextTick is used to wait for the DOM to be fully loaded
          $nextTick(() => {
            const firstIntroTitle = $el.querySelector('.intro-title');
            if (firstIntroTitle) {
              firstIntroTitle.classList.add('is_active');
            }
            // Get all intro titles
            const links = $el.querySelectorAll('.intro-title-link');
            links.forEach(link => {
              //get and extract the anchor from the link
              const anchor = link.getAttribute('href') || link.dataset.anchor;
              const targetId = anchor.replace('#', '');
              const targetElement = document.getElementById(targetId);
              // If the target element exists, create an observer to detect when it is in the viewport
              if (targetElement) {
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      $el.querySelectorAll('.intro-title').forEach(l => l.classList.remove('is_active'));
                      const targetLink = $el.querySelector('[href="' + anchor + '"], [data-anchor="' + anchor + '"]');
                      if (targetLink) {
                        targetLink.closest('.intro-title').classList.add('is_active');
                      }
                    }
                  });
                }, { threshold: 0.5, rootMargin: '-20% 0px -70% 0px' });
                
                observer.observe(targetElement);
              }
            });
          })
        ` }}
      >
        <InnerBlocks.Content />
      </div>
    </div>
  );
};

export default Save;
