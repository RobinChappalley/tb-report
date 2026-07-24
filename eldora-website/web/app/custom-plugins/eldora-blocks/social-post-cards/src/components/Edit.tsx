import {
  InspectorControls,
  RichText,
  useBlockProps,
} from "@wordpress/block-editor";
import {
  PanelBody,
  Spinner,
  TextControl,
} from "@wordpress/components";
import "../styles/editor.scss";
import { SocialPostCardsBlock } from "../types/block";
import { useEffect, useState } from "react";

type Props = {
  clientId: string;
  attributes: SocialPostCardsBlock;
  setAttributes: (attributes: SocialPostCardsBlock) => void;
};

type SocialPost = {
  id: number;
  title: { rendered: string };
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();
  const [isLoading, setIsLoading] = useState(true);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);

  useEffect(() => {
    setAttributes({
      ...attributes,
      id: clientId,
    });
  }, [clientId, attributes.id]);

  useEffect(() => {
    const fetchSocialPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          '/wp-json/wp/v2/social_posts?per_page=3&orderby=date&order=desc&_fields=id,title'
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des actualités');
        }
        
        const posts: SocialPost[] = await response.json();
        setSocialPosts(posts);
      } catch (error) {
        console.error('Erreur lors de la récupération des posts réseaux sociaux:', error);
        setSocialPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocialPosts();
  }, []);

  return (
    <>
      {/* Inspector Controls */}
      <InspectorControls>
        <PanelBody title="Paramètre posts réseaux sociaux">
          {/* -- Title -- */}
          <TextControl
            label="Titre"
            value={attributes.title}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                title: value,
              })
            }
          />

          {/* -- Link -- */}
          <TextControl
            label="Lien"
            value={attributes.link}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                link: value,
              })
            }
          />

          {/* -- Link text -- */}
          <TextControl
            label="Texte du lien"
            value={attributes.linkText}
            onChange={(value) =>
              setAttributes({
                ...attributes,
                linkText: value,
              })
            }
          />

        </PanelBody>
      </InspectorControls>

      {/* -- Admin WP Preview --*/}
      <div {...blockProps}>
        <div className="social-post-cards-preview">
          <div className="social-post-cards-title">
            <RichText
              tagName="div"
              value={attributes.title}
              onChange={(content) =>
                setAttributes({
                  ...attributes,
                  title: content,
                })
              }
              placeholder="Titre"
              className="title"
              allowedFormats={[]}
            />
          </div>
          <div className="social-posts-preview">            
            {isLoading && (
              <div className="social-posts-loading">
                <Spinner />
                <p>Chargement des posts réseaux sociaux...</p>
              </div>
            )}
            {!isLoading && socialPosts.length > 0 && (
              <div className="social-posts-list">
                {socialPosts.map((post) => (
                    <div key={post.id} className="social-post-preview-item">
                      <div className="social-post-preview-image">
                        image
                      </div>
                      <div className="social-post-preview-content">
                        <div className="social-post-preview-placeholder"></div>
                        <div className="social-post-preview-title">
                          {post.title.rendered}
                        </div>
                        <div className="social-post-preview-placeholder"></div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
            {!isLoading && socialPosts.length === 0 && (
              <div className="social-posts-empty">
                <p>Aucun post réseaux sociaux trouvé.</p>
                <p>Publiez un post réseaux sociaux pour voir la carte apparaître ici.</p>
              </div>
            )}
            <div className="social-posts-link">
              <RichText
                tagName="div"
                value={attributes.linkText}
                onChange={(content) =>
                  setAttributes({ ...attributes, linkText: content })
                }
                placeholder="Texte du lien"
                className="link-text"
                allowedFormats={[]}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Edit;
