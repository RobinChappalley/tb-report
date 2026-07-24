<?php

$social_posts = get_posts(
  [
    'post_type' => 'social_posts',
    'posts_per_page' => 3,
    'orderby' => 'date',
    'order' => 'DESC',
    'post_status' => 'publish'
  ]
);

// get acf fields
$posts_data = [];
foreach ($social_posts as $post) {
  $posts_data[] = [
    'image' => get_field('image', $post->ID),
    'is_video' => get_field('is_video', $post->ID),
    'category' => get_field('category', $post->ID),
    'text' => get_field('text', $post->ID),
    'link' => get_field('link', $post->ID),
    'icon' => get_field('icon', $post->ID),
  ];
}

?>
<div class="social-post-cards-container">
    <div class="social-post-cards">
        <div class="social-post-cards-title">
            <?php echo $attributes['title']; ?>
        </div>
        <div class="social-post-cards-list-content">
            <div class="social-post-cards-list">
                <?php foreach ($posts_data as $post) { ?>
                    <a class="social-post-card" href="<?php echo $post['link']['url']; ?>" target="_blank">
                        <div class="social-post-card-image">
                            <img src="<?php echo esc_url($post['image']['url']); ?>" alt="<?php echo esc_attr($post['image']['alt']); ?>">
                  <?php if ($post['is_video']) { ?>
                                <svg>
                                    <use xlink:href="/app/themes/eldora-theme/assets/icons/icons.svg#play" />
                                </svg>
                  <?php } ?>
                        </div>
                        <div class="social-post-card-content">
                            <div class="social-post-card-category"><?php echo $post['category']; ?></div>
                            <div class="social-post-card-text"><?php echo $post['text']; ?></div>
                            <div class="social-post-card-link-container">
                                <div class="social-post-card-link"><?php echo $post['link']['title']; ?></div>
                                <svg>
                                    <use xlink:href="/app/themes/eldora-theme/assets/icons/icons.svg#arrow-external" />
                                </svg>
                            </div>
                            <div class="social-post-card-icon">
                                <svg>
                                    <use xlink:href="/app/themes/eldora-theme/assets/icons/icons.svg#<?php echo $post['icon']; ?>" />
                                </svg>
                            </div>
                        </div>
                    </a>
                <?php } ?>
            </div>
            <div class="social-post-cards-show-more">
                <a href="<?php echo $attributes['link']; ?>"><?php echo $attributes['linkText']; ?></a>
            </div>
        </div>
    </div>
</div>
