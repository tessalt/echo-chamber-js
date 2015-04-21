
Base structural styles and resets for buttons are set in this module.
All buttons share common padding and height, well suited for tap targets on touchscreen displays, and align with form inputs and selects.

Button elements have styles applied by default. To style input buttons and links, add the `.button` class.

```html
<div class="mb1">
  <button>Button</button>
  <a href="#!" class="button">Link Button</a>
  <input type="button" class="button" value="Input Button">
</div>
```

Note: adjusting the line-height and padding variables may require adjustments to form element variables to maintain vertical alignment.

Use the color styles in `basscss-color-base`, `basscss-button-outline`, and `basscss-button-transparent` to adjust the appearance.

