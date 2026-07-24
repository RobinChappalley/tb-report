<?php

/**
 * WP-CLI command for blog setup
 * Usage: wp blog setup [--migrate-posts]
 */

namespace App\CLI;

use WP_CLI;

class BlogSetupCommand
{
  /**
   * Setup blog categories and pages
   *
   * ## OPTIONS
   *
   * [--migrate-posts]
   * : Also migrate existing posts to correct categories
   *
   * ## EXAMPLES
   *
   *     # Setup categories and pages
   *     wp blog setup
   *
   *     # Setup and migrate existing posts
   *     wp blog setup --migrate-posts
   *
   * @when after_wp_load
   */
  public function setup($args, $assoc_args)
  {
    $migrate_posts = isset($assoc_args['migrate-posts']);

    WP_CLI::log('');
    WP_CLI::log('=== SETUP BLOG ELDORA ===');
    WP_CLI::log('');

    // 1. Create parent categories
    WP_CLI::log('1. Création des catégories parent...');
    $actualites_id = $this->createCategory('Actualités', 'actualites', 'Articles d\'actualité');
    $recettes_id = $this->createCategory('Recettes', 'recettes', 'Recettes de cuisine');

    // 2. Create Recettes subcategories
    WP_CLI::log('');
    WP_CLI::log('2. Création des sous-catégories Recettes...');
    if ($recettes_id) {
      $recettes_subcats = [
        ['name' => 'Printemps', 'slug' => 'printemps', 'desc' => 'Recettes de printemps'],
        ['name' => 'Été', 'slug' => 'ete', 'desc' => 'Recettes d\'été'],
        ['name' => 'Automne', 'slug' => 'automne', 'desc' => 'Recettes d\'automne'],
        ['name' => 'Hiver', 'slug' => 'hiver', 'desc' => 'Recettes d\'hiver'],
      ];
      foreach ($recettes_subcats as $subcat) {
        $this->createCategory($subcat['name'], $subcat['slug'], $subcat['desc'], $recettes_id);
      }
    } else {
      WP_CLI::warning('Impossible de créer les sous-catégories (catégorie parent manquante)');
    }

    // 3. Create Actualités subcategories
    WP_CLI::log('');
    WP_CLI::log('3. Création des sous-catégories Actualités...');
    if ($actualites_id) {
      $actualites_subcats = [
        ['name' => 'Événements', 'slug' => 'evenements', 'desc' => 'Événements et manifestations'],
        ['name' => 'Nouveautés', 'slug' => 'nouveautes', 'desc' => 'Nouvelles et annonces'],
        ['name' => 'Partenariats', 'slug' => 'partenariats', 'desc' => 'Partenariats et collaborations'],
      ];
      foreach ($actualites_subcats as $subcat) {
        $this->createCategory($subcat['name'], $subcat['slug'], $subcat['desc'], $actualites_id);
      }
    } else {
      WP_CLI::warning('Impossible de créer les sous-catégories (catégorie parent manquante)');
    }

    // 4. Create Recettes page
    WP_CLI::log('');
    WP_CLI::log('4. Création de la page Recettes...');
    $this->createPage('Recettes', 'recettes', 'page-recettes.php');

    // 5. Migrate posts if requested
    WP_CLI::log('');
    if ($migrate_posts) {
      WP_CLI::log('5. Migration des posts existants...');
      $this->migratePosts();
    } else {
      WP_CLI::log('5. Migration des posts: ignorée (ajouter --migrate-posts pour migrer)');
    }

    // 6. Flush rewrite rules
    WP_CLI::log('');
    WP_CLI::log('6. Finalisation...');
    flush_rewrite_rules();
    WP_CLI::success('Permaliens régénérés');

    WP_CLI::log('');
    WP_CLI::success('=== SETUP TERMINÉ ===');
    WP_CLI::log('');
    WP_CLI::log('URLs:');
    WP_CLI::log('  - Recettes: ' . home_url('/recettes/'));
    WP_CLI::log('  - Actualités: Page définie comme "Page des articles" dans Réglages > Lecture');
  }

  /**
   * Create a category with optional parent
   */
  private function createCategory(string $name, string $slug, string $description, int $parent_id = 0): ?int
  {
    $existing = term_exists($slug, 'category');

    if (!$existing) {
      $result = wp_insert_term(
        $name,
        'category',
        [
          'slug' => $slug,
          'description' => $description,
          'parent' => $parent_id
        ]
      );

      if (is_wp_error($result)) {
        WP_CLI::warning("Erreur création '$name': " . $result->get_error_message());
        return null;
      }

      WP_CLI::success("Catégorie '$name' créée (ID: {$result['term_id']})");
      return $result['term_id'];
    }

    $term_id = is_array($existing) ? $existing['term_id'] : $existing;
    WP_CLI::log("  ✓ Catégorie '$name' existe déjà (ID: $term_id)");
    return $term_id;
  }

  /**
   * Create a page with template
   */
  private function createPage(string $title, string $slug, string $template = ''): ?int
  {
    $existing_page = get_page_by_path($slug);

    if ($existing_page) {
      WP_CLI::log("  ✓ Page '$title' existe déjà (ID: " . $existing_page->ID . ")");
      return $existing_page->ID;
    }

    $page_data = [
      'post_title' => $title,
      'post_name' => $slug,
      'post_status' => 'publish',
      'post_type' => 'page',
      'post_content' => '',
    ];

    if ($template) {
      $page_data['page_template'] = $template;
    }

    $page_id = wp_insert_post($page_data);

    if (is_wp_error($page_id)) {
      WP_CLI::warning("Erreur création page '$title': " . $page_id->get_error_message());
      return null;
    }

    WP_CLI::success("Page '$title' créée (ID: $page_id)");

    // Assign language if Polylang is active
    if (function_exists('pll_set_post_language')) {
      pll_set_post_language($page_id, 'fr');
      WP_CLI::log("  ✓ Langue FR assignée");
    }

    return $page_id;
  }

  /**
   * Migrate existing posts to correct categories
   */
  private function migratePosts(): void
  {
    $recettes_cat = get_term_by('slug', 'recettes', 'category');
    $actualites_cat = get_term_by('slug', 'actualites', 'category');
    $old_recette_cat = get_term_by('slug', 'recette', 'category');
    $old_rezept_cat = get_term_by('slug', 'rezept', 'category');

    if (!$recettes_cat || !$actualites_cat) {
      WP_CLI::warning('Catégories parent manquantes');
      return;
    }

    // Get posts with old recipe categories
    $recipe_post_ids = [];

    if ($old_recette_cat) {
      $recette_posts = get_posts(
        [
          'post_type' => 'post',
          'post_status' => 'publish',
          'numberposts' => -1,
          'cat' => $old_recette_cat->term_id,
          'fields' => 'ids',
        ]
      );
      $recipe_post_ids = array_merge($recipe_post_ids, $recette_posts);
    }

    if ($old_rezept_cat) {
      $rezept_posts = get_posts(
        [
          'post_type' => 'post',
          'post_status' => 'publish',
          'numberposts' => -1,
          'cat' => $old_rezept_cat->term_id,
          'fields' => 'ids',
        ]
      );
      $recipe_post_ids = array_merge($recipe_post_ids, $rezept_posts);
    }

    $recipe_post_ids = array_unique($recipe_post_ids);

    // Get all categories with slug 'recettes' (including translations)
    $recettes_terms = get_terms(
      [
        'taxonomy' => 'category',
        'slug' => 'recettes',
        'hide_empty' => false,
      ]
    );
    $recettes_term_ids = array_map(
      function ($t) {
        return $t->term_id;
      },
      $recettes_terms
    );

    $migrated_recettes = 0;
    foreach ($recipe_post_ids as $post_id) {
      $current_cats = wp_get_post_categories($post_id);

      // Check if already has a recettes category
      $has_recettes = !empty(array_intersect($current_cats, $recettes_term_ids));

      if (!$has_recettes) {
        // Add the first recettes category (FR)
        $current_cats[] = $recettes_cat->term_id;
        wp_set_post_categories($post_id, $current_cats);
        update_field('post_content_type', 'recettes', $post_id);
        $migrated_recettes++;
      }
    }

    // Migrate remaining posts to actualites
    $all_posts = get_posts(
      [
        'post_type' => 'post',
        'post_status' => 'publish',
        'numberposts' => -1,
        'fields' => 'ids',
      ]
    );

    // Get all actualites term IDs
    $actualites_terms = get_terms(
      [
        'taxonomy' => 'category',
        'slug' => 'actualites',
        'hide_empty' => false,
      ]
    );
    $actualites_term_ids = array_map(
      function ($t) {
        return $t->term_id;
      },
      $actualites_terms
    );

    $migrated_actualites = 0;
    foreach ($all_posts as $post_id) {
      $current_cats = wp_get_post_categories($post_id);

      $has_recettes = !empty(array_intersect($current_cats, $recettes_term_ids));
      $has_actualites = !empty(array_intersect($current_cats, $actualites_term_ids));

      if (!$has_recettes && !$has_actualites) {
        $current_cats[] = $actualites_cat->term_id;
        wp_set_post_categories($post_id, $current_cats);
        update_field('post_content_type', 'actualites', $post_id);
        $migrated_actualites++;
      }
    }

    WP_CLI::success("$migrated_recettes posts migrés vers Recettes");
    WP_CLI::success("$migrated_actualites posts migrés vers Actualités");
  }
}
