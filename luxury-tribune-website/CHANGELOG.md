# Changelog

## [Unreleased]
### Changed
- Major Update of wordpress
- Major Update of GraphQL query
- Support of Stripe changes
- Add newsletter popup new design and content
- Add newsletter block new design and content
- Add newsletter footer block new design and content
- Landing page newsletter redesign
- Add component newsletter-type

## [2.2.17] - 2026-07-15
### Changed
- Update about page - LT-265


## [2.2.16] - 2026-04-15
### Fixed
- Fix missing trailing newline in DigitalProduct block export to satisfy Prettier during build

## [2.2.15] - 2026-04-14
### Added
- Gutemberg bloc digitalProduct - LT-255

## [2.2.14] - 2026-02-06
### Fixed
- Remove debug data from API error responses to prevent leaking server internals to frontend

## [2.2.13] - 2026-02-06
### Fixed
- Add debug context to all API error responses for easier troubleshooting
- Improve console logging across subscription flow and API routes
- getStripeCustomer: return error object instead of null when email is missing

## [2.2.12] - 2026-01-21
### Fixed
- Fix coupon

## [2.2.11] - 2026-01-13
### Changed
- Add subscriber form higher in the landing page

## [2.2.10] - 2025-12-12
### Changed
- Add Plausible directly in the code (not from GTM)

## [2.2.9] - 2025-12-09
### Changed
- Add newsletter type field in forms

## [2.2.8] - 2025-12-01
### Changed
- Change newsletter title

## [2.2.7] - 2025-12-01
### Changed
- Add newsletter previous edition link

## [2.2.6] - 2025-11-28
### Changed
- Add newsletter popup new design and content
- Add newsletter block new design and content
- Add newsletter footer block new design and content
- Landing page newsletter redesign
- Add component newsletter-type
- Fix typos
- Fix data-id to the right list

## [2.2.5] - 2025-10-15
### Changed
- Add whatsapp logo header/footer

## [2.2.4] - 2025-08-27
### Fixed
- Issue opn build when page cannot be fetch
- 404 erros not revalidated

## [2.2.3] - 2025-08-27
### Changed
- Update node version to 22

## [2.2.2] - 2025-06-11
### Added
- Add world luxury video in home story - LT-247

### Changed
- Update 404 pages + fix 404 on post/page - LT-244

## [2.2.1] - 2025-03-28
### Changed
- Post Ads : Display only if display_ads is true - LT-240

## [2.2.0] - 2025-03-27
### Added
- Add ads campaign : LT-225

## [2.1.6] - 2024-12-02
### Added
- Change Twitter icon to X icon: LT-220
- Add socials network in the header and footer: LT-220
- Promo config on subscription

## [2.1.5] - 2024-07-12
### Changed
- Change Justine en bio

## [2.1.4] - 2024-07-02
### Changed
- Add Justine and remove Fanny from about page

## [2.1.3] - 2024-03-06
### Fixed
- Ensure menu is closed when switching lang on mobile

## [2.1.2] - 2024-02-13
### Fixed
- Listing: ensure the load more button is present

## [2.1.1] - 2024-02-07
### Fixed
- Fixed catgory listing build

## [2.1.0] - 2024-02-07
### Fixed
- Ensure pages are build on server
- Ensure update subscription endpoint works

## [2.0.7] - 2024-01-29
### Fixed
- HP + listings: try server rendering (at least in FR)

## [2.0.6] - 2024-01-23
### Fixed
- Ensure data is rendered on build

## [2.0.5] - 2024-01-22
### Fixed
- Fixed sitemap

## [2.0.4] - 2024-01-22
### Fixed
- Fixed error 500 on sabonner page

## [2.0.3] - 2024-01-22
### Fixed
- Add OG tags directly in \_app to ensure they are rendered
- GTM: send events for each content_type
- Header: ensure we display the header menus only when we have the data

## [2.0.2] - 2024-01-16
### Fixed
- Commot forgetten: Diminish cache time for all pages

## [2.0.1] - 2024-01-16
### Changed
- Diminish cache time for all pages

## [2.0.0] - 2024-01-16
### Changed
- Massive frontend update: update all packages + switch to getStaticProps

### Added
- Add new tracking

## [1.8.4] - 2023-12-19
### Fixed
- Stories: correct translation url on listing page

## [1.8.3] - 2023-12-19
### Fixed
- Stories: correct translation url on detail page

## [1.8.2] - 2023-11-16
### Fixed
- Fetch correctly the core gallery block

## [1.8.1] - 2023-11-15
### Fixed
- Fix error 500 when image is not shown in Graphql result

## [1.8.0] - 2023-11-15
### Changed
- Api pages: use oAuth to make calls to WooCommerce Rest API
- Update graphql queries following changes in the backend

## [1.7.4] - 2023-11-14
### Changed
- CookieBanner: Remove leckerli config

## [1.7.3] - 2023-11-07
### Changed
- CookieBanner: Use default Leckerli layout

## [1.7.2] - 2023-10-12
### Added
- CookieBanner: add style for customize banner

## [1.7.1] - 2023-10-05
### Added
- CookieBanner: setup CookieBanner with Leckerli

## [1.7.0] - 2023-06-28
### Added
- Detail and listing pages for Mondes du Luxe
- Add links on Mondes du Luxe slider on homepage
- Sitemap: add Mondes du Luxe

## [1.6.0] - 2023-06-28
### Added
- Block: Display embed caption if it exists
- Header: add search form
- Page: Add search result page

## [1.5.1] - 2023-05-08
### Fixed
- Podcast: ensure style attribute is correct for different type of spotify embed

## [1.5.0] - 2023-05-02
### Changed
- Homepage: Use sectionTitle for the Dossier section title

## [1.4.4] - 2023-03-16
### Changed
- About page: update authors

## [1.4.3] - 2023-02-24
### Fixed
- Coupon: handle coupon correctly for users who already have an account

## [1.4.2] - 2023-02-16
### Fixed
- Coupon: handle when no coupon is given

## [1.4.1] - 2023-02-16
### Fixed
- Coupon: handle when no coupon is given

## [1.4.0] - 2022-11-10
### Changed
- Note: Before MEP, run the following SQL requests:

### Fixed
- Coupon: handle coupon settings to prevent reusing them ad infinitum

### Added
- Subscription form: add coupon field

### Changed
- Upgrade engine node requirement to >=16.0.0

## [1.3.5] - 2022-09-22
### Fixed
- Gift form: Fix validation schema

## [1.3.4] - 2022-08-04
### Fixed
- Subscription error (stripe) when adding a new subsription to an existing customer

## [1.3.3] - 2022-07-04
### Fixed
- Registration Newsletter

## [1.3.2] - 2022-05-17
### Changed
- Newsletter form: add checkbox to signup to news newsletter

## [1.3.1] - 2022-04-22
### Changed
- Page about: change EN job title

## [1.3.0] - 2022-04-20
### Changed
- Page about: change people
- Subscription: handle query param

## [1.2.0] - 2022-04-06
### Added
- Add locale in data given when registering new user

### Fixed
- Fixed language switcher following changes in WPGraphQL

## [1.1.0] - 2022-03-17
### Changed
- Revert changes and include the previous style file for Calendar component

### Added
- Add block Newsletter and modify cta Newsletter in Recommandation component
- Add newsletter popup on article pages

## [1.0.31] - 2022-02-24
### Fixed
- Fixed event query on homepage
- Fixed error 500 if event has translation in draft

## [1.0.30] - 2022-02-24
### Fixed
- Fix error on event links

## [1.0.29] - 2022-02-24
### Fixed
- Fix error on events

## [1.0.28] - 2022-02-15
### Added
- Add news on homepage + adapt listing and teasers

### Fixed
- Fix validationShape for subscription forms

## [1.0.27] - 2022-01-13
### Fixed
- Fix subscriptions products not showing

## [1.0.26] - 2022-01-13
### Changed
- Update deps (update to nextJS 12 + tailwindCSS 3)

## [1.0.25] - 2021-12-16
### Changed
- Modify Teaser responsiveness

## [1.0.24] - 2021-11-16
### Fixed
- Fix fetch authors

## [1.0.23] - 2021-11-15
### Fixed
- Fetch api pages with absolute instead of relative url
- Modify fetch events data
- Fix Link to manifest.json

## [1.0.22] - 2021-10-11
### Fixed
- Fix bug embed youtube video

## [1.0.21] - 2021-10-07
### Fixed
- Fix fetch featured image for og:image

## [1.0.20] - 2021-09-01
### Changed
- Edit the title and meta description for the homepage

## [1.0.19] - 2021-08-26
### Added
- Add spotify embed in Embed block component

## [1.0.18] - 2021-08-18
### Changed
- Remove unnecessary env variables
- Update list of members on About page

## [1.0.17] - 2021-06-22
### Changed
- Use new images sizes

## [1.0.16] - 2021-05-19
### Changed
- Change image sizes for post teasers

## [1.0.15] - 2021-05-18
### Changed
- Remove Quality Image Compression

## [1.0.14] - 2021-05-17
### Changed
- Improve JSONLD #116
- Update sitemap to contain data from backend in frontend URL #114
- Reduce number of stories and posts on the homepage
- Update queries' structure to match the update in the backend #118
- Improve 404 by displaying the error message instead of redirecting #115
- Update to nextjs 10 + upgrade other packages #117
- Add FadeInImage component which uses next/image #119
- Fix js bug caused by invalid date range on event

## [1.0.13] - 2021-05-05
### Fixed
- Safari: Fix js bug caused by invalid date range on event

## [1.0.12] - 2021-05-04
### Fixed
- Fix a bug with teaser event link from the english homepage

## [1.0.11] - 2021-02-22
### Changed
- Reduce image sizes #111
- Add missing url to sitemap #108
- Add cache header

## [1.0.10] - 2021-01-28
### Changed
- Replace AuthToken by RefreshToken and set expired date #110
- Add tracking for Worlds of Luxury, events, subscription #107

## [1.0.9] - 2021-01-19
### Fixed
- Fix World of Luxury link on main menu
- Fix client side recognition of search engine for premium article content #104

## [1.0.8] - 2021-01-14
### Changed
- Render special characters properly in modal story #100
- Correction after review design #102
- Fix bug spacing in BigTribuneTeaser component
- Add World of Luxury to main menu #101
- Add client side recognition of search engine for premium article content

## [1.0.7] - 2020-12-16
### Added
- Add order subscription process #94
- Add Login and password recovery process #97
- Add coupon page and process #84
- Improve 404 page
- Add Terms and Conditions page

## [1.0.6] - 2020-11-27
### Added
- Add stories teaser component on homepage #88
- Add story modal component #89

## [1.0.5] - 2020-10-29
### Fixed
- Fix og:image (0796182)

## [1.0.4] - 2020-10-28
### Fixed
- Add optional chaining where missing

## [1.0.3] - 2020-10-28
### Changed
- Small enhancements and fix of bugs related to authors CPT #25

## [1.0.2] - 2020-10-27
### Changed
- Fix bug display tribune teaser #86
- Create author page + add dynamically authors to the sclr page #71
- Add all event related commit

## [1.0.1] - 2020-10-13
### Changed
- Revert all event related commit

## [1.0.0] - 2020-10-13
### Changed
- Add 2 new authors on SCLR page

[Unreleased]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.16...HEAD
[2.2.16]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.15...2.2.16
[2.2.15]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.14...2.2.15
[2.2.14]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.13...2.2.14
[2.2.13]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.12...2.2.13
[2.2.12]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.11...2.2.12
[2.2.11]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.10...2.2.11
[2.2.10]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.9...2.2.10
[2.2.9]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.8...2.2.9
[2.2.8]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.7...2.2.8
[2.2.7]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.6...2.2.7
[2.2.6]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.5...2.2.6
[2.2.5]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.4...2.2.5
[2.2.4]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.3...2.2.4
[2.2.3]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.2...2.2.3
[2.2.2]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.1...2.2.2
[2.2.1]: https://github.com/antistatique/luxury-tribune-website/compare/2.2.0...2.2.1
[2.2.0]: https://github.com/antistatique/luxury-tribune-website/compare/2.1.6...2.2.0
[2.1.6]: https://github.com/antistatique/luxury-tribune-website/compare/2.1.5...2.1.6
[2.1.5]: https://github.com/antistatique/luxury-tribune-website/compare/2.1.4...2.1.5
[2.1.4]: https://github.com/antistatique/luxury-tribune-website/compare/2.1.3...2.1.4
[2.1.3]: https://github.com/antistatique/luxury-tribune-website/compare/2.1.2...2.1.3
[2.1.2]: https://github.com/antistatique/luxury-tribune-website/compare/2.1.1...2.1.2
[2.1.1]: https://github.com/antistatique/luxury-tribune-website/compare/2.1.0...2.1.1
[2.1.0]: https://github.com/antistatique/luxury-tribune-website/compare/2.0.7...2.1.0
[2.0.7]: https://github.com/antistatique/luxury-tribune-website/compare/2.0.6...2.0.7
[2.0.6]: https://github.com/antistatique/luxury-tribune-website/compare/2.0.5...2.0.6
[2.0.5]: https://github.com/antistatique/luxury-tribune-website/compare/2.0.4...2.0.5
[2.0.4]: https://github.com/antistatique/luxury-tribune-website/compare/2.0.3...2.0.4
[2.0.3]: https://github.com/antistatique/luxury-tribune-website/compare/2.0.2...2.0.3
[2.0.2]: https://github.com/antistatique/luxury-tribune-website/compare/2.0.1...2.0.2
[2.0.1]: https://github.com/antistatique/luxury-tribune-website/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/antistatique/luxury-tribune-website/compare/1.8.4...2.0.0
[1.8.4]: https://github.com/antistatique/luxury-tribune-website/compare/1.8.3...1.8.4
[1.8.3]: https://github.com/antistatique/luxury-tribune-website/compare/1.8.2...1.8.3
[1.8.2]: https://github.com/antistatique/luxury-tribune-website/compare/1.8.1...1.8.2
[1.8.1]: https://github.com/antistatique/luxury-tribune-website/compare/1.8.0...1.8.1
[1.8.0]: https://github.com/antistatique/luxury-tribune-website/compare/1.7.4...1.8.0
[1.7.4]: https://github.com/antistatique/luxury-tribune-website/compare/1.7.3...1.7.4
[1.7.3]: https://github.com/antistatique/luxury-tribune-website/compare/1.7.2...1.7.3
[1.7.2]: https://github.com/antistatique/luxury-tribune-website/compare/1.7.1...1.7.2
[1.7.1]: https://github.com/antistatique/luxury-tribune-website/compare/1.7.0...1.7.1
[1.7.0]: https://github.com/antistatique/luxury-tribune-website/compare/1.6.0...1.7.0
[1.6.0]: https://github.com/antistatique/luxury-tribune-website/compare/1.5.1...1.6.0
[1.5.1]: https://github.com/antistatique/luxury-tribune-website/compare/1.5.0...1.5.1
[1.5.0]: https://github.com/antistatique/luxury-tribune-website/compare/1.4.4...1.5.0
[1.4.4]: https://github.com/antistatique/luxury-tribune-website/compare/1.4.3...1.4.4
[1.4.3]: https://github.com/antistatique/luxury-tribune-website/compare/1.4.2...1.4.3
[1.4.2]: https://github.com/antistatique/luxury-tribune-website/compare/1.4.1...1.4.2
[1.4.1]: https://github.com/antistatique/luxury-tribune-website/compare/1.4.0...1.4.1
[1.4.0]: https://github.com/antistatique/luxury-tribune-website/compare/1.3.5...1.4.0
[1.3.5]: https://github.com/antistatique/luxury-tribune-website/compare/1.3.4...1.3.5
[1.3.4]: https://github.com/antistatique/luxury-tribune-website/compare/1.3.3...1.3.4
[1.3.3]: https://github.com/antistatique/luxury-tribune-website/compare/1.3.2...1.3.3
[1.3.2]: https://github.com/antistatique/luxury-tribune-website/compare/1.3.1...1.3.2
[1.3.1]: https://github.com/antistatique/luxury-tribune-website/compare/1.3.0...1.3.1
[1.3.0]: https://github.com/antistatique/luxury-tribune-website/compare/1.2.0...1.3.0
[1.2.0]: https://github.com/antistatique/luxury-tribune-website/compare/1.1.0...1.2.0
[1.1.0]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.31...1.1.0
[1.0.31]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.30...1.0.31
[1.0.30]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.29...1.0.30
[1.0.29]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.28...1.0.29
[1.0.28]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.27...1.0.28
[1.0.27]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.26...1.0.27
[1.0.26]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.25...1.0.26
[1.0.25]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.24...1.0.25
[1.0.24]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.23...1.0.24
[1.0.23]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.22...1.0.23
[1.0.22]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.21...1.0.22
[1.0.21]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.20...1.0.21
[1.0.20]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.19...1.0.20
[1.0.19]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.18...1.0.19
[1.0.18]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.17...1.0.18
[1.0.17]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.16...1.0.17
[1.0.16]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.15...1.0.16
[1.0.15]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.14...1.0.15
[1.0.14]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.13...1.0.14
[1.0.13]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.12...1.0.13
[1.0.12]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.11...1.0.12
[1.0.11]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.10...1.0.11
[1.0.10]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.9...1.0.10
[1.0.9]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.8...1.0.9
[1.0.8]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.7...1.0.8
[1.0.7]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.6...1.0.7
[1.0.6]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.5...1.0.6
[1.0.5]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.4...1.0.5
[1.0.4]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.3...1.0.4
[1.0.3]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.2...1.0.3
[1.0.2]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/antistatique/luxury-tribune-website/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/antistatique/luxury-tribune-website/releases/tag/1.0.0
