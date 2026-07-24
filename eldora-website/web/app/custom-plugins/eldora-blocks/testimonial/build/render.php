<?php
if (empty($attributes['testimonial'])) {
  return;
}
?>

<!-- embla__slide use only when in a slider-testimonials blocks -->
<div class="testimonial embla__slide">
    <div class="testimonial-content">“<?php echo $attributes['testimonial']; ?>”</div>
    <div class="author">
        <?php echo $attributes['name']; ?> <?php echo $attributes['jobCompany']; ?>
    </div>
</div>