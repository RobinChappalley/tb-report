---
title: Images
---

# Images

### Basics

According to the [Responsive Images Community Group](https://responsiveimages.org/), we have to think of devices when we deliver an image. The only `<img>` tag is not enough anymore. To provide responsive images we have to use the `<picture>` tag (not `<srcset>`) :

````html

<picture>
  <source media="(min-width: 40em)"
    srcset="big.jpg 1x, big-hd.jpg 2x">
  <source 
    srcset="small.jpg 1x, small-hd.jpg 2x">
  <img src="fallback.jpg" alt="">
</picture>
````

### Support

The picture tag is not currently well [supported](http://caniuse.com/#feat=picture) (IE ✘, Edge ✘, Firefox 38+, Chrome 38+, Safari ✘, Safari iOS ✘, Andriod Browser 40+, Opera 25+, Opera Mini ✘), so we have to use the official [polyfill](http://scottjehl.github.io/picturefill/) :

````html
<head>
  <script>
    // Picture element HTML5 shiv
    document.createElement( "picture" );
  </script>
  <script src="picturefill.js" async></script>
</head>
````