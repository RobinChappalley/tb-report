import { useMemo, useState } from "react";
import {
  AdvancedImage,
  accessibility,
  lazyload,
  placeholder,
  responsive,
} from "@cloudinary/react";
import { CloudinaryImage } from "@cloudinary/url-gen/assets/CloudinaryImage";
import { Delivery } from "@cloudinary/url-gen/actions/delivery";
import { Format } from "@cloudinary/url-gen/qualifiers/format";

const DEFAULT_CLOUD_NAME = "di5rp4t2p";
const DEFAULT_SOURCE_URL =
  "https://image.chapi.ch/wp-content/uploads/raw/image-test-2.jpg";

export default function CloudinaryPlayground() {
  const [sourceUrl, setSourceUrl] = useState(DEFAULT_SOURCE_URL);
  const [cloudName, setCloudName] = useState(DEFAULT_CLOUD_NAME);
  const [useLazyload, setUseLazyload] = useState(true);
  const [useResponsive, setUseResponsive] = useState(true);
  const [useAccessibility, setUseAccessibility] = useState(true);
  const [usePlaceholder, setUsePlaceholder] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const cldImg = useMemo(() => {
    const image = new CloudinaryImage(sourceUrl, {
      cloudName,
    });
    image.setDeliveryType("fetch");
    image.delivery(Delivery.format(Format.auto()));
    image.delivery(Delivery.quality("auto"));
    return image;
  }, [cloudName, sourceUrl]);

  const plugins = [
    useLazyload ? lazyload() : null,
    useResponsive ? responsive() : null,
    useAccessibility ? accessibility() : null,
    usePlaceholder ? placeholder() : null,
  ].filter(Boolean);

  return (
    <div className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Cloudinary React playground</p>
          <h1>
            Tester le composant AdvancedImage sans bricoler le reste du projet.
          </h1>
          <p className="lede">
            Cette page permet de voir comment le composant réagit avec les
            plugins Cloudinary les plus courants, et de comparer facilement le
            chargement, le rendu et l’URL générée.
          </p>
        </div>

        <div className="status-pill">
          <span className={isLoaded ? "dot dot-live" : "dot"} />
          {isLoaded ? "Image chargée" : "En attente de chargement"}
        </div>
      </section>

      <main className="grid-layout">
        <section className="panel preview-panel">
          <div className="panel-header">
            <div>
              <h2>Prévisualisation</h2>
              <p>
                Changez les options à gauche puis observez le comportement du
                composant et de l’URL fetch Cloudinary générée.
              </p>
            </div>
          </div>

          <div className="image-frame">
            <AdvancedImage
              cldImg={cldImg}
              plugins={plugins}
              onLoad={() => setIsLoaded(true)}
              onError={() => setIsLoaded(false)}
              className="cloudinary-image"
              alt="Image Cloudinary de test"
            />
          </div>

          <div className="helper-note">
            <strong>À vérifier :</strong> le comportement du lazy load, la
            génération du src responsive et le rendu visuel du placeholder.
          </div>
        </section>

        <aside className="panel controls-panel">
          <div className="panel-header">
            <div>
              <h2>Réglages</h2>
              <p>
                Vous pouvez tester une autre source fetch ou désactiver les
                plugins un par un.
              </p>
            </div>
          </div>

          <label className="field">
            <span>Cloud name</span>
            <input
              value={cloudName}
              onChange={(event) => setCloudName(event.target.value)}
              spellCheck="false"
            />
          </label>

          <label className="field">
            <span>Fetch source URL</span>
            <input
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
              spellCheck="false"
            />
          </label>

          <div className="toggle-list">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={useLazyload}
                onChange={(event) => setUseLazyload(event.target.checked)}
              />
              <span>lazyload()</span>
            </label>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={useResponsive}
                onChange={(event) => setUseResponsive(event.target.checked)}
              />
              <span>responsive()</span>
            </label>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={useAccessibility}
                onChange={(event) => setUseAccessibility(event.target.checked)}
              />
              <span>accessibility()</span>
            </label>
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={usePlaceholder}
                onChange={(event) => setUsePlaceholder(event.target.checked)}
              />
              <span>placeholder()</span>
            </label>
          </div>

          <div className="snippet">
            <div className="snippet-label">URL générée</div>
            <code>{cldImg.toURL()}</code>
          </div>

          <div className="snippet">
            <div className="snippet-label">Plugins actifs</div>
            <code>{plugins.length > 0 ? plugins.length : "aucun"}</code>
          </div>
        </aside>
      </main>
    </div>
  );
}
