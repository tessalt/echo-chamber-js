# Basscss Color Buttons

<p class="hide">Button color styles module for Basscss</p>

<a href="http://basscss.com" class="hide">basscss.com</a>

Includes the following basic button modules:
`.button-blue`,
`.button-blue-outline`,
`.button-light-gray`,
`.button-red`,
`.button-nav-light`, and
`.button-nav-dark`.

Use these styles on button elements, or with the `basscss-base-buttons` module for links and input buttons.

```html
<div class="mb1">
  <button>Button</button>
  <a href="#!" class="button">Link Button</a>
  <input type="button" class="button" value="Input Button">
</div>
<div class="mb1">
  <button class="button-blue mb1">Button Blue</button>
  <button class="button-blue-outline mb1">Button Blue Outline</button>
  <button class="button-light-gray mb1">Button Light Gray</button>
  <button class="button-red mb1">Button Red</button>
</div>
```

Button styles can be used for navigation. The `.button-nav-light` style adds a subtle hover effect for links on a light background.

```html
<div class="mxn1">
  <a href="#!" class="button button-narrow button-nav-light">Burgers</a>
  <a href="#!" class="button button-narrow button-nav-light">Fries</a>
  <a href="#!" class="button button-narrow button-nav-light">Shakes</a>
  <a href="#!" class="button button-narrow button-nav-light">Onion Rings</a>
</div>
```

For dark backgrounds, use the `.button-nav-dark` style.

```html
<div class="bg-dark-gray">
  <a href="#!" class="button button-narrow button-nav-dark">Burgers</a>
  <a href="#!" class="button button-narrow button-nav-dark">Fries</a>
  <a href="#!" class="button button-narrow button-nav-dark">Shakes</a>
  <a href="#!" class="button button-narrow button-nav-dark">Onion Rings</a>
</div>
```

