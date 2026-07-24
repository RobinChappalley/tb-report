import { 
  InspectorControls, 
  RichText, 
  useBlockProps 
} from "@wordpress/block-editor";
import { PanelBody, TextControl, Spinner } from "@wordpress/components";
import { useEffect, useState } from "react";
import "../styles/editor.scss";
import { NewsCardContainerBlock } from "../types/block";

type Props = {
  clientId: string;
  attributes: NewsCardContainerBlock;
  setAttributes: (attributes: NewsCardContainerBlock) => void;
};

type NewsPost = {
  id: number;
  title: { rendered: string };
};

const Edit = ({ clientId, attributes, setAttributes }: Props) => {
  const blockProps = useBlockProps();
  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (attributes.id !== clientId) {
      setAttributes({
        ...attributes,
        id: clientId,
      });
    }
  }, [clientId, attributes.id]);

  // get 3 last news
  useEffect(() => {
    const fetchNewsTitles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          '/wp-json/wp/v2/posts?per_page=3&orderby=date&order=desc&_fields=id,title'
        );
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des actualités');
        }
        
        const posts: NewsPost[] = await response.json();
        setNewsPosts(posts);
      } catch (error) {
        console.error('Erreur lors de la récupération des actualités:', error);
        setNewsPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsTitles();
  }, []);

  return (
    <>
      <InspectorControls>
        <PanelBody title="Options du container">
          <TextControl
            label="Titre"
            value={attributes.title || ''}
            onChange={(title) => setAttributes({ ...attributes, title })}
          />
          <TextControl
            label="Texte du bouton"
            value={attributes.show || ''}
            onChange={(show) => setAttributes({ ...attributes, show })}
          />
        </PanelBody>
      </InspectorControls>

      {/* Preview */}
      <div {...blockProps}>
        <div className="news-card-container-preview">
          
          {/* Header */}
          <div className="news-card-header">
            <div className="news-card-header-title">
              <RichText
                tagName="h2"
                value={attributes.title || ''}
                onChange={(title) => setAttributes({ ...attributes, title })}
                placeholder="Titre de la section actualités"
              />
            </div>
            <div className="news-card-header-show-more">
              <RichText
                tagName="p"
                value={attributes.show || ''}
                onChange={(show) => setAttributes({ ...attributes, show })}
                placeholder="Texte du bouton (ex: Voir toutes les actualités)"
              />
            </div>
          </div>

          {/* news */}
          <div className="news-cards-preview">            
            {isLoading && (
              <div className="news-cards-loading">
                <Spinner />
                <p>Chargement des actualités...</p>
              </div>
            )}
            {!isLoading && newsPosts.length > 0 && (
              <div className="news-cards-list">
                {newsPosts.map((post, index) => (
                    <div key={post.id} className="news-card-preview-item">
                      <div className="news-card-preview-image">
                        image
                      </div>
                      <div className="news-card-preview-content">
                        <div className="news-card-preview-placeholder"></div>
                        <div className="news-card-preview-title">
                          {post.title.rendered}
                        </div>
                        <div className="news-card-preview-placeholder"></div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
            {!isLoading && newsPosts.length === 0 && (
              <div className="news-cards-empty">
                <p>Aucune actualité trouvée.</p>
                <p>Publiez une actualité pour voir les cartes apparaître ici.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </>
  );
};

export default Edit;
