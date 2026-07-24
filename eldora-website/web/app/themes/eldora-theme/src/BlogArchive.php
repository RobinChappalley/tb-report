<?php

/**
 * BlogArchive helper class
 * Handles the logic for blog archive pages (Actualités, Recettes, etc.)
 * Supports Polylang translations
 */

namespace App;

use Timber\Timber;

class BlogArchive
{
  private string $parent_category_slug;
  private string $template;
  private ?object $parent_category = null;
  private array $all_parent_category_ids = [];

  public function __construct(string $parent_category_slug, string $template = 'templates/archive-posts.twig')
  {
    $this->parent_category_slug = $parent_category_slug;
    $this->template = $template;
    $this->parent_category = $this->getParentCategoryForCurrentLanguage();
    $this->all_parent_category_ids = $this->getAllTranslatedCategoryIds();
  }

  /**
   * Render the archive page
   */
  public function render(): void
  {
    $context = Timber::context();

    $paged = get_query_var('paged') ? get_query_var('paged') : 1;
    $selected_category = isset($_GET['category']) ? sanitize_text_field($_GET['category']) : '';

    // Get all filter parameters (for multiple category filters)
    // Supports comma-separated multi-values (e.g. ?gang=vorspeise,hauptgang)
    $selected_filters = [];
    foreach ($_GET as $key => $value) {
      if (!empty($value) && $key !== 'paged' && $key !== 'page') {
        $slugs = array_map('sanitize_text_field', explode(',', $value));
        $slugs = array_filter($slugs);
        $selected_filters[$key] = $slugs;
      }
    }

    $context['paged'] = $paged;
    $context['selected_category'] = $selected_category;
    $context['selected_filters'] = $selected_filters;
    $context['parent_category_slug'] = $this->parent_category_slug;

    // Build query args
    $query_args = [
      'post_type' => 'post',
      'post_status' => 'publish',
      'paged' => $paged,
    ];

    // Build grouped valid categories: each group can have multiple slugs (OR within group, AND between groups)
    $valid_groups = [];

    // Check legacy 'category' parameter
    if ($selected_category && $this->isValidSubcategory($selected_category)) {
      $valid_groups['category'] = [$selected_category];
    }

    // Check new filter parameters (each value is an array of slugs)
    foreach ($selected_filters as $filter_key => $filter_slugs) {
      if ($filter_key === 'category') {
        continue;
      }
      $valid_slugs = array_filter($filter_slugs, [$this, 'isValidSubcategory']);
      if (!empty($valid_slugs)) {
        $valid_groups[$filter_key] = array_values($valid_slugs);
      }
    }

    if (!empty($valid_groups)) {
      // AND between groups, OR within each group
      $query_args['tax_query'] = [
        'relation' => 'AND',
      ];
      foreach ($valid_groups as $group_slugs) {
        $query_args['tax_query'][] = [
          'taxonomy' => 'category',
          'field' => 'slug',
          'terms' => $group_slugs,
        ];
      }
    } elseif (!empty($this->all_parent_category_ids)) {
      // Show all posts from parent categories and their children (all translations)
      // Use tax_query to include children of all translated parent categories
      $query_args['tax_query'] = [
        'relation' => 'OR',
      ];
      foreach ($this->all_parent_category_ids as $cat_id) {
        $query_args['tax_query'][] = [
          'taxonomy' => 'category',
          'field' => 'term_id',
          'terms' => $cat_id,
          'include_children' => true,
        ];
      }
    } else {
      // Parent category doesn't exist - show error
      $context['error_message'] = sprintf(
        'La catégorie "%s" n\'existe pas. Veuillez exécuter le script de setup.',
        $this->parent_category_slug
      );
    }

    // First page: 6 posts, other pages: 5 posts
    $query_args['posts_per_page'] = ($paged == 1) ? 6 : 5;

    $context['posts'] = Timber::get_posts($query_args);

    // Get subcategories for the filter dropdown
    $context['subcategories'] = $this->getSubcategories();

    // Get all parent categories with their children for multiple dropdowns (not filtered by current posts)
    $context['all_parent_categories'] = $this->getAllAvailableParentCategoriesWithChildren();

    // Set filter labels based on category
    $context['filter_label'] = $this->getFilterLabel();
    $context['filter_placeholder'] = $this->getFilterPlaceholder();
    $context['parent_category_name'] = $this->parent_category ? $this->parent_category->name : '';

    Timber::render($this->template, $context);
  }

  /**
   * Check if the parent category exists
   */
  public function hasParentCategory(): bool
  {
    return $this->parent_category !== null;
  }

  /**
   * Get parent category for current language (Polylang aware)
   */
  private function getParentCategoryForCurrentLanguage(): ?object
  {
    // Temporarily disable Polylang language filter to find the base term by slug,
    // since the slug may belong to another language (e.g. "recettes" is FR-only).
    $polylang_active = function_exists('PLL') && PLL() && isset(PLL()->terms);
    $has_polylang_filter = $polylang_active
    ? has_filter('terms_clauses', [PLL()->terms, 'terms_clauses'])
    : false;

    if ($has_polylang_filter !== false) {
      remove_filter('terms_clauses', [PLL()->terms, 'terms_clauses'], $has_polylang_filter);
    }

    $term = get_term_by('slug', $this->parent_category_slug, 'category');

    // Restore Polylang filter
    if ($has_polylang_filter !== false) {
      add_filter('terms_clauses', [PLL()->terms, 'terms_clauses'], $has_polylang_filter, 3);
    }

    if (!$term) {
      return null;
    }

    // If Polylang is active, get the term in current language
    if (function_exists('pll_get_term')) {
      $current_lang = function_exists('pll_current_language') ? pll_current_language() : 'fr';
      $translated_term_id = pll_get_term($term->term_id, $current_lang);

      if ($translated_term_id && $translated_term_id !== $term->term_id) {
        $translated_term = get_term($translated_term_id, 'category');
        if ($translated_term && !is_wp_error($translated_term)) {
          return $translated_term;
        }
      }
    }

    return $term;
  }

  /**
   * Get all translated category IDs (for queries that need to include all languages)
   */
  private function getAllTranslatedCategoryIds(): array
  {
    if (!$this->parent_category) {
      return [];
    }

    // Use Polylang to get all translations of the parent category
    if (function_exists('pll_get_term_translations')) {
      $translations = pll_get_term_translations($this->parent_category->term_id);
      if (!empty($translations)) {
        return array_values($translations);
      }
    }

    return [$this->parent_category->term_id];
  }

  /**
   * Check if a category slug is a valid subcategory of any parent category
   */
  private function isValidSubcategory(string $slug): bool
  {
    $term = get_term_by('slug', $slug, 'category');
    if (!$term) {
      return false;
    }

    // Check if this is a subcategory (has a parent that is not 0)
    if ($term->parent == 0) {
      return false;
    }

    // Get parent to make sure it exists
    $parent_term = get_term($term->parent, 'category');
    return !is_wp_error($parent_term) && $parent_term;
  }

  /**
   * Get subcategories of the parent category (current language)
   */
  private function getSubcategories(): array
  {
    if (!$this->parent_category) {
      return [];
    }

    $terms = get_terms(
      [
        'taxonomy' => 'category',
        'parent' => $this->parent_category->term_id,
        'hide_empty' => false, // Temporairement changé pour déboguer
        'orderby' => 'name',
        'order' => 'ASC',
      ]
    );

    return is_array($terms) ? $terms : [];
  }

  /**
   * Get parent categories with their children for filter dropdowns.
   *
   * Walks the category tree from the current parent category:
   * - Children with grandchildren → each becomes a dropdown group
   *   (e.g. Recettes > Saison > [Printemps, Été, Automne, Hiver])
   * - Children without grandchildren → grouped under the parent category
   *   (e.g. Actualités > [Événements, Nouveautés, Partenariats])
   */
  private function getAllAvailableParentCategoriesWithChildren(): array
  {
    if (!$this->parent_category) {
      return [];
    }

    // Get direct children of the current (translated) parent category
    $children = get_terms(
      [
        'taxonomy' => 'category',
        'parent' => $this->parent_category->term_id,
        'hide_empty' => false,
        'orderby' => 'name',
        'order' => 'ASC',
      ]
    );

    if (is_wp_error($children) || empty($children)) {
      return [];
    }

    $result = [];
    $leaf_children = [];

    foreach ($children as $child) {
      // Check if this child has its own children (grandchildren)
      $grandchildren = get_terms(
        [
          'taxonomy' => 'category',
          'parent' => $child->term_id,
          'hide_empty' => false,
          'orderby' => 'name',
          'order' => 'ASC',
        ]
      );

      if (!is_wp_error($grandchildren) && !empty($grandchildren)) {
        // Child has grandchildren → separate dropdown group
        $result[] = [
          'parent' => $child,
          'children' => $grandchildren,
        ];
      } else {
        // Leaf child → collect for grouping under parent
        $leaf_children[] = $child;
      }
    }

    // Group leaf children under the current parent category
    if (!empty($leaf_children)) {
      $result[] = [
        'parent' => $this->parent_category,
        'children' => $leaf_children,
      ];
    }

    // Sort groups by parent name
    usort(
      $result,
      function ($a, $b) {
        return strcmp($a['parent']->name, $b['parent']->name);
      }
    );

    return $result;
  }

  /**
   * Get filter label for accessibility
   */
  private function getFilterLabel(): string
  {
    return __($this->parent_category_slug . '.form.select', 'eldora-theme');
  }

  /**
   * Get filter placeholder text
   */
  private function getFilterPlaceholder(): string
  {
    return __($this->parent_category_slug . '.form.select-placeholder', 'eldora-theme');
  }
}
