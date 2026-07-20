const SiteConfigQuery = () => `
query SiteConfigQuery {
  seo {
    schema {
      companyLogo {
        sourceUrl
      }
    }
  }
  acfOptionsOptions {
    general {
      facebook
      instagram
      linkedin
    }
  }
  fr_headerMainMenu: menuItems(where: {location: HEADER_MAIN_MENU}) {
    nodes {
      ...menuItemContent
    }
  }
  en_headerMainMenu: menuItems(where: {language: EN, location: HEADER_MAIN_MENU}) {
    nodes {
      ...menuItemContent
    }
  }
  fr_headerSecondaryMenu: menuItems(where: {location: HEADER_SECONDARY_MENU}) {
    nodes {
      ...menuItemContent
    }
  }
  en_headerSecondaryMenu: menuItems(where: {language: EN, location: HEADER_SECONDARY_MENU}) {
    nodes {
      ...menuItemContent
    }
  }
  fr_footerMainMenu: menuItems(where: {location: FOOTER_MAIN_MENU}) {
    nodes {
      ...menuItemContent
    }
  }
  en_footerMainMenu: menuItems(where: {language: EN, location: FOOTER_MAIN_MENU}) {
    nodes {
      ...menuItemContent
    }
  }
  fr_footerSecondaryMenu: menuItems(where: {location: FOOTER_SECONDARY_MENU}) {
    nodes {
      ...menuItemContent
    }
  }
  en_footerSecondaryMenu: menuItems(where: {language: EN, location: FOOTER_SECONDARY_MENU}) {
    nodes {
      ...menuItemContent
    }
  }
}

fragment menuItemContent on MenuItem {
  connectedObject {
    __typename
    ... on Category {
      uri
    }
    ... on Page {
      uri
    }
    ... on Post {
      uri
    }
    ... on Type {
      uri
    }
  }
  label
}
`;
export default SiteConfigQuery;
