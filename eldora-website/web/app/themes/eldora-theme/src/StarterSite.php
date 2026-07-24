<?php

/**
 * StarterSite class
 * This class is used to add custom functionality to the theme.
 */

namespace App;

use Timber\Site;
use Timber\Timber;

/**
 * Class StarterSite.
 */
class StarterSite extends Site
{
  /**
   * Custom post type prefixes based on language.
   *
   * @var array
   */
  private $custom_post_type_prefixes = [
    'fr' => [
      'presses' => 'eldora/medias/presse',
      'publications' => 'eldora/medias/nos-publications',
      'jobs' => 'eldora/gestion-des-talents/presentation-des-metiers',
      'sectors' => 'secteurs',
    ],
    'de' => [
      'presses' => 'ueber-eldora/medien/presse',
      'publications' => 'ueber-eldora/medien/publikationen',
      'jobs' => 'ueber-eldora/karriere-bei-eldora/berufe-bei-eldora',
      'sectors' => 'sectors',
    ],
  ];

  /**
   * StarterSite constructor.
   */
  public function __construct()
  {
    add_action('after_setup_theme', [ $this, 'theme_supports' ]);
    add_action('init', [ $this, 'register_post_types' ]);
    add_action('init', [ $this, 'register_taxonomies' ]);
    add_action('init', [ $this, 'add_custom_rewrite_rules' ]);
    add_action('acf/init', [ $this, 'register_options_page' ]);

    add_filter('timber/context', [ $this, 'add_to_context' ]);
    add_filter('timber/twig/functions', [ $this, 'add_functions_to_twig' ]);
    add_filter('timber/twig/environment/options', [ $this, 'update_twig_environment_options' ]);
    add_filter('pll_translation_url', [ $this, 'translate_custom_post_type_urls' ], 10, 2);

    parent::__construct();
  }

  /**
   * This is where you can register custom post types.
   */
  public function register_post_types()
  {
    register_post_type(
      'sectors',
      [
        'labels' => [
          'name' => __('sectors.labels.name', 'eldora-theme'),
          'singular_name' => __('sectors.labels.singular_name', 'eldora-theme'),
          'add_new_item' => __('sectors.labels.add_new_item', 'eldora-theme'),
        ],
        'public' => true,
        'menu_icon' => 'dashicons-tag',
        'show_in_rest' => true,
        'has_archive' => false,
        'supports' => ['title', 'editor'],
        'publicly_queryable'  => true,
        'query_var' => true,
        'rewrite' => ['slug' => $this->get_post_type_prefix('sectors'), 'with_front' => false],
      ]
    );

    register_post_type(
      'social_posts',
      [
        'labels' => [
          'name' => __('social_posts.labels.name', 'eldora-theme'),
          'singular_name' => __('social_posts.labels.singular_name', 'eldora-theme'),
          'add_new_item' => __('social_posts.labels.add_new_item', 'eldora-theme'),
        ],
        'public' => true,
        'menu_icon' => 'dashicons-share',
        'show_in_rest' => true,
        'has_archive' => false,
        'supports' => ['title'],
        'publicly_queryable'  => true,
        'query_var' => true,
      ]
    );

    register_post_type(
      'presses',
      [
        'labels' => [
          'name' => __('presses.labels.name', 'eldora-theme'),
          'singular_name' => __('presses.labels.singular_name', 'eldora-theme'),
          'add_new_item' => __('presses.labels.add_new_item', 'eldora-theme'),
        ],
        'public' => true,
        'menu_icon' => 'dashicons-media-text',
        'show_in_rest' => true,
        'has_archive' => true,
        'supports' => ['title'],
        'publicly_queryable'  => true,
        'rewrite' => ['slug' => $this->get_post_type_prefix('presses'), 'with_front' => false],
        'query_var' => true,
      ]
    );

    register_post_type(
      'publications',
      [
        'labels' => [
          'name' => __('publications.labels.name', 'eldora-theme'),
          'singular_name' => __('publications.labels.singular_name', 'eldora-theme'),
          'add_new_item' => __('publications.labels.add_new_item', 'eldora-theme'),
        ],
        'public' => true,
        'menu_icon' => 'dashicons-book',
        'show_in_rest' => true,
        'has_archive' => true,
        'supports' => ['title'],
        'publicly_queryable'  => true,
        'rewrite' => ['slug' => $this->get_post_type_prefix('publications'), 'with_front' => false],
        'query_var' => true,
      ]
    );

    register_post_type(
      'testimonials',
      [
        'labels' => [
          'name' => __('testimonials.labels.name', 'eldora-theme'),
          'singular_name' => __('testimonials.labels.singular_name', 'eldora-theme'),
          'add_new_item' => __('testimonials.labels.add_new_item', 'eldora-theme'),
        ],
        'public' => true,
        'menu_icon' => 'dashicons-format-quote',
        'show_in_rest' => true,
        'has_archive' => false,
        'supports' => ['title'],
        'publicly_queryable'  => false,
        'query_var' => false,
      ]
    );

    register_post_type(
      'jobs',
      [
        'labels' => [
          'name' => __('jobs.labels.name', 'eldora-theme'),
          'singular_name' => __('jobs.labels.singular_name', 'eldora-theme'),
          'add_new_item' => __('jobs.labels.add_new_item', 'eldora-theme'),
        ],
        'public' => true,
        'menu_icon' => 'dashicons-businessman',
        'show_in_rest' => true,
        'has_archive' => true,
        'supports' => ['title', 'editor', 'thumbnail'],
        'publicly_queryable' => true,
        'rewrite' => ['slug' => $this->get_post_type_prefix('jobs'), 'with_front' => false],
        'query_var' => true,

        'template' => [
          ['eldora/full-screen-image'],
          ['eldora/gradient-container', [], [
            ['eldora/two-columns'],
            ['eldora/testimonials-slider', ['title' => 'Témoignages']],
          ]
          ],
          ['eldora/text-image-grid'],
        ],
      ]
    );
  }

  /**
   * This is where you can register custom taxonomies.
   */
  public function register_taxonomies()
  {
  }

  /**
   * This is where you can register option page acf.
   */
  public function register_options_page()
  {
    acf_add_options_page(
      [
        'page_title' => "Options",
        'menu_title' => "Options",
        'menu_slug' => 'acf-options',
        'capability' => 'edit_posts',
      ]
    );

    acf_add_options_sub_page(
      [
        'page_title' => 'En-tête',
        'menu_title' => 'En-tête',
        'parent_slug' => 'acf-options',
        'capability' => 'edit_posts',
      ]
    );

    acf_add_options_sub_page(
      [
        'page_title' => 'Pied de page',
        'menu_title' => 'Pied de page',
        'parent_slug' => 'acf-options',
        'capability' => 'edit_posts',
      ]
    );

    acf_add_options_sub_page(
      [
        'page_title' => 'Réseaux sociaux',
        'menu_title' => 'Réseaux sociaux',
        'parent_slug' => 'acf-options',
        'capability' => 'edit_posts',
      ]
    );

    acf_add_options_sub_page(
      [
        'page_title' => 'Pop-up',
        'menu_title' => 'Pop-up',
        'parent_slug' => 'acf-options',
        'capability' => 'edit_posts',
      ]
    );
  }

  /**
   * This is where you add some context.
   *
   * @param array $context context['this'] Being the Twig's {{ this }}
   */
  public function add_to_context($context)
  {
    $context['site']  = $this;

    $context['theme_color'] = !empty(get_field('theme_color')) ? get_field('theme_color') : 'eldora';

    $current_lang = function_exists('pll_current_language') ? pll_current_language() : 'fr';
    $context['languages'] = function_exists('pll_the_languages') ? pll_the_languages([ 'raw' => 1 ]) : [];
    $context['current_language'] = $current_lang;
    $context['current_language_home_url'] = function_exists('pll_home_url') ? pll_home_url() : home_url();

    $context['is_homepage'] = is_front_page();

    $context['header'] = [
      'nav' => Timber::get_menu('Primary ' . $current_lang),
      'nav_secondary' => Timber::get_menu('Secondary ' . $current_lang),
      'contact_link' => get_field('contact_page_link', 'option'),
    ];

    $site_map_url = get_field('site_map', 'option');
    $site_map = null;
    if ($site_map_url) {
      $post_id = url_to_postid($site_map_url);
      $site_map = [
        'url' => $site_map_url,
        'title' => $post_id ? get_the_title($post_id) : $site_map_url,
        'target' => '',
      ];
    }

    $context['footer'] = [
      'address' => get_field('address', 'option'),
      'phone' => get_field('phone', 'option'),
      'email' => get_field('email', 'option'),
      'privacy_policy' => get_field('privacy_policy', 'option'),
      'cookie_policy' => get_field('cookie_policy', 'option'),
      'site_map' => $site_map,
    ];

    $context['socials'] = [
      'facebook' => get_field('facebook', 'option'),
      'instagram' => get_field('instagram', 'option'),
      'linkedin' => get_field('linkedin', 'option'),
      'youtube' => get_field('youtube', 'option'),
    ];

    $popup_image = get_field('image', 'option') ?: null;
    $button_link = get_field('button_link', 'option') ?: null;

    $context['popup'] = [
      'is_visible' => get_field('display', 'option') ? true : false,
      'image' => $popup_image,
      'has_video' => get_field('video', 'option') ? true : false,
      'title' => get_field('title', 'option') ?: '',
      'subtitle' => get_field('subtitle', 'option') ?: '',
      'text' => get_field('text', 'option') ?: '',
      'button' => $button_link,
    ];

    return $context;
  }

  /**
   * This is where you can add your theme supports.
   */
  public function theme_supports()
  {
    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    /*
    * Let WordPress manage the document title.
    * By adding theme support, we declare that this theme does not use a
    * hard-coded <title> tag in the document head, and expect WordPress to
    * provide it for us.
    */
    add_theme_support('title-tag');

    /*
    * Enable support for Post Thumbnails on posts and pages.
    *
    * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
    */
    add_theme_support('post-thumbnails');

    /*
    * Switch default core markup for search form, comment form, and comments
    * to output valid HTML5.
    */
    add_theme_support(
      'html5',
      [
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
      ]
    );

    /*
    * Enable support for Post Formats.
    *
    * See: https://codex.wordpress.org/Post_Formats
    */
    add_theme_support(
      'post-formats',
      [
        'aside',
        'image',
        'video',
        'quote',
        'link',
        'gallery',
        'audio',
      ]
    );

    add_theme_support('menus');
  }


  /**
   * This is where you can add your own functions to twig.
   *
   * @link https://timber.github.io/docs/v2/hooks/filters/#timber/twig/functions
   * @param array $functions an array of existing Twig functions.
   */
  public function add_functions_to_twig($functions)
  {
    $additional_functions = [
      'get_theme_mod' => [
        'callable' => 'get_theme_mod',
      ],
      'get_breadcrumbs' => [
        'callable' => [$this, 'get_breadcrumbs'],
      ],
      'imgproxy' => [
        'callable' => [$this, 'imgproxy_url'],
      ],
    ];



    //coucou
    return array_merge($functions, $additional_functions);
  }

  /**
   * Updates Twig environment options.
   *
   * @see https://twig.symfony.com/doc/2.x/api.html#environment-options
   *
   * @param array $options an array of environment options
   *
   * @return array
   */
  public function update_twig_environment_options($options)
  {
    // $options['autoescape'] = true;

    return $options;
  }

  /**
   * Build an imgproxy URL for a given source URL.
   * Uses `IMGPROXYURL` + either signed path (if `IMGPROXYKEY`/`IMGPROXYSALT` present)
   * or the `insecure` path when no key/salt are defined.
   *
   * @param string $src  The original image URL (absolute or site-relative)
   * @param string $ops  The imgproxy operations string (e.g. "resize:fill:800:600")
   * @return string      The imgproxy URL or original src if IMGPROXYURL not set
   */
  public function imgproxy_url($src, $ops = '')
  {
    if (!$src) {
      return '';
    }

    // Try multiple sources for env vars: getenv, $_ENV, $_SERVER, and project env() helper
    $imgproxy_base = getenv('IMGPROXYURL') ?: ($_ENV['IMGPROXYURL'] ?? $_SERVER['IMGPROXYURL'] ?? (function_exists('env') ? env('IMGPROXYURL') : (defined('IMGPROXYURL') ? IMGPROXYURL : '')));
    $key_hex = getenv('IMGPROXYKEY') ?: ($_ENV['IMGPROXYKEY'] ?? $_SERVER['IMGPROXYKEY'] ?? (function_exists('env') ? env('IMGPROXYKEY') : (defined('IMGPROXYKEY') ? IMGPROXYKEY : '')));
    $salt_hex = getenv('IMGPROXYSALT') ?: ($_ENV['IMGPROXYSALT'] ?? $_SERVER['IMGPROXYSALT'] ?? (function_exists('env') ? env('IMGPROXYSALT') : (defined('IMGPROXYSALT') ? IMGPROXYSALT : '')));

    // Ensure absolute URL for source
    if (strpos($src, '//') === false) {
      $src = home_url($src);
    }

    // encode source as plain (base64 URL-safe without padding)
    $encoded = rtrim(strtr(base64_encode($src), '+/', '-_'), '=');

    $ops = trim($ops, '/');
    $path = ($ops !== '' ? $ops . '/' : '') . 'plain/' . $encoded;

    if (!$imgproxy_base) {
      // no imgproxy configured — log for debug and return original src
      error_log('imgproxy: no IMGPROXYURL found in env; returning original src');
      return $src;
    }

    $imgproxy_base = rtrim($imgproxy_base, '/');

    if ($key_hex && $salt_hex) {
      // Build signed URL. This implementation follows imgproxy signing pattern:
      // signature = base64url( HMAC-SHA256( hex2bin(key), hex2bin(salt) . '/' . path ) )
      $binary_key = @hex2bin($key_hex);
      $binary_salt = @hex2bin($salt_hex);

      if ($binary_key !== false && $binary_salt !== false) {
        $to_sign = '/' . $path;
        $raw = hash_hmac('sha256', $binary_salt . $to_sign, $binary_key, true);
        $signature = rtrim(strtr(base64_encode($raw), '+/', '-_'), '=');

        $final = $imgproxy_base . '/' . $signature . '/' . $path;
        error_log('imgproxy: returning signed url ' . $final);
        return $final;
      }
    }

    // Fallback to insecure path (no signature)
    $final = $imgproxy_base . '/insecure/' . $path;
    error_log('imgproxy: returning insecure url ' . $final);
    return $final;
  }

  public function get_breadcrumbs()
  {
    global $post;

    if (!$post && !is_post_type_archive()) {
      return [];
    }

    $breadcrumbs = [
      'home' => [
        'title' => __('breadcrumbs.home', 'eldora-theme'),
        'url' => home_url('/'),
        'is_current' => false
      ],
      'current' => [],
      'pages' => []
    ];

    // Handle post types and post archives.
    if (is_post_type_archive() || is_home()) {
      $post_type = get_query_var('post_type');
      if (empty($post_type)) {
        $post_type = get_post_type();
      }

      $breadcrumbs['current'] = [
        'title' => __($post_type . '.archive-page.title', 'eldora-theme'),
        'url' => get_post_type_archive_link($post_type),
        'is_current' => true
      ];
      $breadcrumbs['pages'] = $this->get_custom_post_type_ancestors($post_type);

      return $breadcrumbs;
    }

    $breadcrumbs['current'] = [
      'title' => $post->post_title,
      'url' => get_permalink($post->ID),
      'is_current' => true
    ];

    // If this is a page with parents, build the hierarchy
    if ($post->post_parent) {
      $ancestors = array_reverse(get_post_ancestors($post));

      foreach ($ancestors as $ancestor_id) {
        $ancestor = get_post($ancestor_id);
        $breadcrumbs['pages'][] = [
          'title' => $ancestor->post_title,
          'url' => get_permalink($ancestor_id),
          'is_current' => false
        ];
      }
    }

    // Handle custom post type parents
    if (!$post->post_parent && $post->post_type !== 'post' && $post->post_type !== 'page') {
      $post_type = $post->post_type;
      $post_type_object = get_post_type_object($post_type);

      $breadcrumbs['pages'] = $this->get_custom_post_type_ancestors($post_type);

      if ($post_type_object->has_archive) {
        $breadcrumbs['pages'][] = [
          'title' => __($post_type . '.archive-page.title', 'eldora-theme'),
          'url' => get_post_type_archive_link($post_type),
          'is_current' => false
        ];
      }
    }

    return $breadcrumbs;
  }

  /**
   * Get ancestors for a custom post type archive.
   *
   * @param string $post_type The custom post type.
   * @return array The breadcrumbs array.
   */
  public function get_custom_post_type_ancestors(string $post_type): array
  {
    $ancestors = [];

    $post_type_url = get_post_type_archive_link($post_type);

    if (!$post_type_url) {
      return $ancestors;
    }

    $post_type_path = parse_url($post_type_url, PHP_URL_PATH);
    $current_lang = function_exists('pll_current_language') ? pll_current_language() : 'fr';
    if ($current_lang !== 'fr' && $post_type_path) {
      $post_type_path = preg_replace('/^\/[a-z]{2}\//', '/', $post_type_path);
    }

    $post_type_path_parts = array_filter(explode('/', trim($post_type_path, '/')));
    for ($i = 0; $i < count($post_type_path_parts); $i++) {
      $ancestor_parts = array_slice($post_type_path_parts, 0, $i);
      $ancestor_path = implode('/', $ancestor_parts);

      if (empty($ancestor_path)) {
        continue;
      }

      $ancestor_page = get_page_by_path($ancestor_path, OBJECT, 'page');

      if ($ancestor_page) {
        $ancestors[] = [
          'title' => $ancestor_page->post_title,
          'url' => get_permalink($ancestor_page->ID),
          'is_current' => false
        ];
      }
    }

    return $ancestors;
  }

  /**
   * Get post type prefix from ACF options based on current language.
   *
   * @param string $post_type The post type slug.
   * @return string The localized prefix or default post type slug.
   */
  public function get_post_type_prefix($post_type)
  {
    if (!function_exists('pll_current_language')) {
      return $post_type;
    }
    return $this->custom_post_type_prefixes[pll_current_language()][$post_type] ?? $post_type;
  }

  /**
   * Add custom rewrite rules based on post type prefixes.
   */
  public function add_custom_rewrite_rules()
  {
    foreach ($this->custom_post_type_prefixes as $lang_code => $prefixes) {
      $lang_prefix = ($lang_code === 'fr') ? '' : $lang_code . '/';

      foreach ($prefixes as $post_type => $prefix) {
        $single_rule = '^' . $lang_prefix . $prefix . '/([^/]+)/?$';
        $single_redirect = 'index.php?' . $post_type . '=$matches[1]&lang=' . $lang_code;
        add_rewrite_rule($single_rule, $single_redirect, 'top');

        $archive_rule = '^' . $lang_prefix . $prefix . '/?$';
        $archive_redirect = 'index.php?post_type=' . $post_type . '&lang=' . $lang_code;
        add_rewrite_rule($archive_rule, $archive_redirect, 'top');
      }
    }
  }

  /**
   * Translate custom post type URLs for different languages.
   *
   * @param string $url The current URL.
   * @param string $target_lang The target language code.
   * @return string The translated URL.
   */
  public function translate_custom_post_type_urls($url, $target_lang)
  {
    if (!function_exists('pll_current_language')) {
      return $url;
    }

    $current_lang = pll_current_language();

    if (!$url || !isset($this->custom_post_type_prefixes[$target_lang]) || $current_lang === $target_lang) {
      return $url;
    }

    // Try to find matching post type and translate
    foreach ($this->custom_post_type_prefixes[$current_lang] as $post_type => $current_prefix) {
      $current_prefix = ($target_lang === 'fr') ? $current_prefix : $target_lang . '/' . $current_prefix;

      if (preg_match('#://[^/]+/' . preg_quote($current_prefix, '#') . '(/|$)#', $url) && isset($this->custom_post_type_prefixes[$target_lang][$post_type])) {
        $target_prefix = $this->custom_post_type_prefixes[$target_lang][$post_type];
        $target_prefix = ($target_lang === 'fr') ? $target_prefix : $target_lang . '/' . $target_prefix;

        return str_replace($current_prefix, $target_prefix, $url);
      }
    }

    return $url;
  }
}
