<?php

/**
 * Functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 * @link https://github.com/timber/starter-theme
 */

namespace App;

use Timber\Timber;

// Load Composer dependencies.
require_once __DIR__ . '/../../../../vendor/autoload.php';

// Load config
require_once __DIR__ . '/config/allowed-files-mods.php';
require_once __DIR__ . '/config/disable-comments.php';
require_once __DIR__ . '/config/restrict-heading-block.php';

Timber::init();

new StarterSite();

// Register WP-CLI commands
if (defined('WP_CLI') && WP_CLI) {
  require_once __DIR__ . '/src/CLI/BlogSetupCommand.php';
  \WP_CLI::add_command('eldora-blog', CLI\BlogSetupCommand::class);
}

// Add Tailwind output styles and scripts
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\my_theme_enqueue_styles_scripts');
function my_theme_enqueue_styles_scripts()
{
  $theme = wp_get_theme();
  wp_enqueue_style('custom-styles', get_template_directory_uri() . '/assets/styles/output.css', [], $theme->get('Version'));
  wp_enqueue_script_module('custom-scripts', get_template_directory_uri() . '/assets/scripts/base.js', [], $theme->get('Version'));
}

// Add CSS for WP admin
add_action('admin_enqueue_scripts', __NAMESPACE__ . '\my_theme_enqueue_styles_admin');
function my_theme_enqueue_styles_admin()
{
  $theme = wp_get_theme();
  wp_enqueue_style('custom-admin-styles', get_template_directory_uri() . '/assets/styles/admin.css', [], $theme->get('Version'));
}


// Auto-assign parent category based on ACF "post_content_type" field
// This preserves subcategories while ensuring the correct parent category is set
add_action('acf/save_post', __NAMESPACE__ . '\auto_assign_category_from_acf', 20);
function auto_assign_category_from_acf($post_id)
{
  // Only for posts, not revisions or autosaves
  if (wp_is_post_revision($post_id) || wp_is_post_autosave($post_id)) {
    return;
  }

  // Only for post type "post"
  if (get_post_type($post_id) !== 'post') {
    return;
  }

  // Get the content type from ACF
  $content_type = get_field('post_content_type', $post_id);

  if (!$content_type) {
    return;
  }

  // Get the new parent category
  $new_parent_category = get_term_by('slug', $content_type, 'category');

  if (!$new_parent_category) {
    return;
  }

  // Get current categories
  $current_categories = wp_get_post_categories($post_id);

  // Get the other parent category to remove it if present
  $other_parent_slug = ($content_type === 'actualites') ? 'recettes' : 'actualites';
  $other_parent_category = get_term_by('slug', $other_parent_slug, 'category');

  // Filter out the other parent category and its children, keep everything else
  $new_categories = [];
  foreach ($current_categories as $cat_id) {
    $cat = get_term($cat_id, 'category');
    if (!$cat) {
      continue;
    }

    // Skip if it's the other parent category
    if ($other_parent_category && $cat_id == $other_parent_category->term_id) {
      continue;
    }

    // Skip if it's a child of the other parent category
    if ($other_parent_category && $cat->parent == $other_parent_category->term_id) {
      continue;
    }

    $new_categories[] = $cat_id;
  }

  // Add the new parent category if not already present
  if (!in_array($new_parent_category->term_id, $new_categories)) {
    $new_categories[] = $new_parent_category->term_id;
  }

  // Update categories
  wp_set_post_categories($post_id, $new_categories);
}

// Sync ACF field when category is changed manually
add_action('acf/load_value/key=field_post_content_type', __NAMESPACE__ . '\sync_content_type_from_category', 10, 3);
function sync_content_type_from_category($value, $post_id, $field)
{
  // Only for posts
  if (get_post_type($post_id) !== 'post') {
    return $value;
  }

  // If ACF field is already set, use it
  if ($value) {
    return $value;
  }

  // Get post categories
  $categories = wp_get_post_categories($post_id, ['fields' => 'slugs']);

  // Check if post has actualites or recettes category
  if (in_array('actualites', $categories)) {
    return 'actualites';
  } elseif (in_array('recettes', $categories)) {
    return 'recettes';
  }

  // Default to actualites
  return 'actualites';
}

// allowed gutenberg blocks
add_filter('allowed_block_types_all', __NAMESPACE__ . '\allowed_block_types', 10, 2);
function allowed_block_types($allowed_blocks, $context)
{
  $post_type = '';
  if (isset($context->post)) {
    $post_type = get_post_type($context->post);
  }

  if ($post_type === 'sectors') {
    return [
      'core/paragraph',
      'core/heading',
      'core/list',
      'core/list-item',
      'core/html',
      'eldora/two-columns',
      'eldora/two-columns-column',
      'eldora/accordion',
      'eldora/media',
      'eldora/headings-description-card',
      'eldora/headings-description-card-container',
      'eldora/image-carousel-static',
      'eldora/full-screen-image',
      'eldora/testimonial',
      'eldora/testimonials-slider',
      'eldora/numbered-card',
      'eldora/numbered-cards-container',
      'eldora/pole-card',
      'eldora/pole-card-container',
      'eldora/gradient-container',
    ];
  }

  return [
    'core/paragraph',
    'core/list',
    'core/list-item',
    'core/image',
    'core/heading',
    'core/html',
    'eldora/two-columns',
    'eldora/two-columns-column',
    'eldora/image-metrics',
    'eldora/full-screen-image',
    'eldora/text-image-grid',
    'eldora/image-carousel-static',
    'eldora/gradient-container',
    'eldora/numbered-card',
    'eldora/numbered-cards-container',
    'eldora/action',
    'eldora/actions-container',
    'eldora/accordion',
    'eldora/testimonial',
    'eldora/testimonials-slider',
    'eldora/media',
    'eldora/pole-card',
    'eldora/pole-card-container',
    'eldora/headings-description-card',
    'eldora/headings-description-card-container',
    'eldora/image-text-card',
    'eldora/image-text-card-container',
    'eldora/news-card-container',
    'eldora/parent-card',
    'eldora/parent-card-container',
    'eldora/intro-title',
    'eldora/intro-title-container',
    'eldora/social-post-cards',
    'eldora/commitment-card',
    'eldora/commitment-card-container',
    'eldora/image-metrics',
    'eldora/image-metrics-number',
  ];
}
