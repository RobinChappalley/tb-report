/* eslint-disable react/no-danger */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { isNil, toLower } from "ramda";

import Ad from "components/Ad";
import Lead from "components/blocks/Lead";
import FadeInImage from "components/FadeInImage";
import NewsletterPopup from "components/NewsletterPopup";
import Recommendations from "components/Recommendations";
import SocialBar from "components/SocialBar";
import SocialShare from "components/SocialShare";
import useAds from "hooks/useAdsCampaign";
import gtm from "services/google-tag-manager";
import resolveBlocksComponents from "utils/resolveBlocksComponents";
import resolveCategory from "utils/resolveCategory";
import safePath from "utils/safePath";
import sanitizeSlug from "utils/sanitizeSlug";

import { listSubscriptionCustomer } from "../../client/wooCommerceClient";
import { newsCategories } from "../../config/config";

const Post = ({ content, host, author, isSearchEngine }) => {
  const [validSubscription, setValidSubscription] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const popupDismissed = Cookies.get("dismiss-nl-popup") === "true";
  const { asPath } = useRouter();
  const { i18n } = useTranslation();

  const ads = useAds({
    area: "article",
    formats: "970_250,480_320,300_250",
  });

  // eslint-disable-next-line consistent-return
  const checkSubscription = async () => {
    const token = Cookies.get("refreshToken");
    const isAuth = !isNil(token);

    if (!isAuth) {
      return setValidSubscription(false);
    }

    const decoded = jwtDecode(token);
    await listSubscriptionCustomer({
      wooCommerceCustomerId: decoded.data.user.id,
    })().then((subscriptions) =>
      setValidSubscription(subscriptions?.[0]?.status === "active"),
    );
  };

  useEffect(() => {
    checkSubscription();
    gtm.dl({
      fullname: content.postAuthors?.author?.[0]?.title,
      category: resolveCategory(content.categories.nodes)?.name,
      type: content?.premium?.isPremium ? "premium" : "standard",
      content_type:
        resolveCategory(content.categories.nodes)?.name ===
        newsCategories[i18n.language]
          ? "news"
          : "article",
    });
    gtm.event("PageView", {
      page_path: asPath,
      page_title: content.title,
    });
  }, [asPath, content]);

  // Show newsletter popup after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpenPopup(true);
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const { t } = useTranslation();
  const sponsorship = safePath("sponsorship.sponsored", content, false);

  const type = sponsorship
    ? t("post.sponsor")
    : safePath("types.nodes.0.name", content, null);

  return (
    <>
      {content?.displayAds?.displayAds && ads && ads["970_250"] && (
        <Ad ad={ads["970_250"]} format="970_250" area="article" />
      )}

      <div className="mx-15 md:mx-0">
        <div className="content-container !mt-30 md:!mt-50 flow-root">
          <div className="inline-flex">
            {content?.premium?.isPremium && (
              <span
                className="text-gold uppercase text-15 font-soehneKraftig tracking-wider leading-20 mr-10 border-solid border border-gold"
                style={{ padding: "2px 6px" }}
              >
                {t("subscription.post.full")}
              </span>
            )}
            {content.categories.nodes && (
              <span
                className="text-orange uppercase text-15 font-soehneKraftig tracking-wider leading-20"
                style={{ paddingTop: "2px" }}
                dangerouslySetInnerHTML={{
                  __html: resolveCategory(content.categories.nodes)?.name,
                }}
              />
            )}
            {type && (
              <span
                className="uppercase text-15 font-soehneKraftig tracking-wider leading-20 border-l border-solid border-sand-700 pl-5 ml-5"
                style={{ paddingTop: "2px" }}
                dangerouslySetInnerHTML={{ __html: type }}
              />
            )}
          </div>
          <h1 dangerouslySetInnerHTML={{ __html: content.title }} />
          {content.lead && <Lead lead={content.lead.lead} />}
          {author && (
            <div className="flex flex-wrap items-center mt-30 mb-15 md:mb-40">
              <div style={{ width: "8rem" }}>
                <FadeInImage
                  alt={author.title}
                  src={
                    author.authorMetadatas.avatar?.node
                      ? author.authorMetadatas.avatar.node.sourceUrl
                      : "/avatar.png"
                  }
                  width={1}
                  height={1}
                  className="rounded-full"
                />
              </div>
              <p className="flex-grow ml-15 text-19">
                By
                <Link href={sanitizeSlug(author.uri)}>
                  <span
                    className="font-soehneKraftig text-15 leading-20 uppercase tracking-wide"
                    dangerouslySetInnerHTML={{
                      __html: ` ${author.title}`,
                    }}
                  />
                </Link>
                <span className="block text-15 leading-20">
                  {toLower(
                    format(new Date(content.date), "dd MMMM yyyy", {
                      locale: fr,
                    }),
                  )}
                </span>
              </p>
              <div className="mt-25 md:mt-0">
                {author.authorMetadatas.links && (
                  <SocialBar socialInfos={author.authorMetadatas.links} />
                )}
              </div>
            </div>
          )}
        </div>
        {content.editorBlocks &&
          resolveBlocksComponents(
            content.editorBlocks,
            validSubscription,
            isSearchEngine,
            false,
            content?.displayAds?.displayAds ? ads : undefined,
          ).map(({ component, props }, i) =>
            React.createElement(component, { key: i, ...props }),
          )}
        {sponsorship && (
          <div className="content-container border-t border-b border-solid border-sand-500 my-60 py-10">
            <p className="font-soehneLeicht text-15 leading-22">
              {`En partenariat avec `}
              {content.sponsorship?.sponsorlink && (
                <a
                  href={content.sponsorship?.sponsorlink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-soehneKraftig tracking-wider uppercase"
                >
                  {content.sponsorship?.sponsor}
                </a>
              )}
              {!content.sponsorship?.sponsorlink && (
                <span className="font-soehneKraftig tracking-wider uppercase">
                  {content.sponsorship?.sponsor}
                </span>
              )}
            </p>
          </div>
        )}

        <div className="content-container !mt-30 md:!mt-60">
          <p className="font-soehneKraftig text-15 leading-22 uppercase tracking-wide">
            {t("post.share")}
          </p>
          <SocialShare
            host={host}
            contentType={
              content.categories &&
              resolveCategory(content.categories.nodes)?.name ===
                newsCategories[i18n.language]
                ? "news"
                : "article"
            }
            title={content.title}
          />
        </div>
        <Recommendations
          posts={content.related?.posts?.nodes}
          postTitle={content.title}
        />

        <AnimatePresence initial={false}>
          {!popupDismissed && openPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NewsletterPopup setOpenPopup={setOpenPopup} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

Post.propTypes = {
  content: PropTypes.object.isRequired,
  host: PropTypes.string,
  author: PropTypes.object,
  isSearchEngine: PropTypes.bool,
};

export default Post;
