<?php

$news = get_posts(
  [
    'post_type' => 'post',
    'posts_per_page' => 3,
    'orderby' => 'date',
    'order' => 'DESC',
    'post_status' => 'publish'
  ]
);

?>

<div id="news-card-container-<?php echo esc_attr($attributes['id'] ?? ''); ?>" class="news-card-container">
    <div class="news-card-container-content">
        
        <div class="news-card-header-title">
            <?php echo esc_html($attributes['title']); ?>
        </div>
        <div class="news-card-header-show-more">
            <a href="<?php echo get_post_type_archive_link('post'); ?>">
                <?php echo esc_html($attributes['show']); ?>
            </a>
        </div>

        <div class="embla-mobile-slider">
            <div class="embla__container">
                
                <?php if (count($news) > 0) { ?>
                  <?php foreach ($news as $post) { ?>
                    <?php
                    $post_id = $post->ID;
                    $post_title = $post->post_title;
                    $post_link = get_permalink($post_id);
                    $post_date = date('j F Y', strtotime($post->post_date));
                    $featured_image_id = get_post_thumbnail_id($post_id);

                    $image_src = '';
                    $image_alt = $post_title;
                    $image_large = '';

                    if ($featured_image_id) {
                      $image_src = wp_get_attachment_image_url($featured_image_id, 'medium');
                      $image_large = wp_get_attachment_image_url($featured_image_id, 'large');
                      $image_alt = get_post_meta($featured_image_id, '_wp_attachment_image_alt', true) ?: $post_title;
                    }

                    $categories = get_the_terms($post_id, 'category');
                    ?>
                        
                        <div id="news-card-<?php echo esc_attr($post_id); ?>" class="wp-block-eldora-news-card news-card embla__slide">
                            <div class="news-card-content">
                                <a href="<?php echo esc_url($post_link); ?>">
                                    
                                    <div class="news-card-image-container">
                    <?php if ($image_src) { ?>
                                            <picture>
                      <?php if ($image_large) { ?>
                                                    <source srcset="<?php echo esc_url($image_large); ?>" media="(min-width: 768px)" />
                      <?php } ?>
                                                <img class="image" src="<?php echo esc_url($image_src); ?>" alt="<?php echo esc_attr($image_alt); ?>" loading="lazy" />
                                            </picture>
                    <?php } ?>
                                    </div>
                                    
                                    <div class="news-card-text">
                                        <div class="news-card-categories">
                    <?php if ($categories) { ?>
                      <?php foreach ($categories as $category) { ?>
                                                    <div class="category"><?php echo esc_html($category->name); ?></div>
                      <?php } ?>
                    <?php } ?>
                                        </div>
                                        <div class="title"><?php echo esc_html($post_title); ?></div>
                                        <div class="date"><?php echo esc_html($post_date); ?></div>
                                    </div>
                                    
                                </a>
                            </div>
                        </div>
                        
                  <?php } ?>
                    
                <?php } else { ?>
                    <!-- Fallback if no news -->
                    <div class="news-cards-empty">
                        <p><?php echo __('news-card.no-news-available', 'eldora-theme'); ?></p>
                    </div>
                <?php } ?>
                
            </div>
        </div>
        
    </div>
</div>
