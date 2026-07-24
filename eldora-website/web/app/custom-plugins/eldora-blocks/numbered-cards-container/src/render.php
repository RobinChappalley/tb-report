<div class="numbered-cards-container" x-data="{ showAllCards: false }">
    <div class="titre-text-container">
        <?php if (!empty($attributes['title'])) : ?>
            <h4 class="title h4"><?php echo $attributes['title']; ?></h4>
        <?php endif; ?>
        <?php if (!empty($attributes['text'])) : ?>
            <div class="text"><?php echo $attributes['text']; ?></div>
        <?php endif; ?>
    </div>

    <div
        class="children-container"
        x-bind:class="showAllCards && 'show-all-cards'"
    >
        <?php echo $content; ?>
    </div>

    <?php if ($attributes['countCardsHidden'] > 0) : ?>
        <div
            class="mobile-show-all-cards"
            x-show="!showAllCards"
            x-on:click="showAllCards = true"
        >
      <?php echo sprintf(__('block.numbered-cards.show-all-cards', 'eldora-theme'), $attributes['countCardsHidden']); ?>
        </div>
    <?php endif; ?>
</div>