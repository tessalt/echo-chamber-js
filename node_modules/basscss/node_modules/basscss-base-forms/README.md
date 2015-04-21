
This modules sets structural styles for base form elements, creating a consistent visual rhythm among forms
while allowing for color to be adjusted where needed.
These styles do not rely on markup structure and can be combined with
utilities to make fine-grained, contextual adjustments.
Form element styles are intended to be interoperable with all other utility styles.


## Inline Forms
By default, form elements follow browser defaults and display inline.
Note: the `.field-light` style is part of `basscss-color-forms`.

```html
<form>
  <label for="search">Search</label>
  <input id="search" type="text" class="field-light">
  <button class="button">Go</button>
</form>
```

## Stacked Forms

Use `.block`, `.full-width`, and other layout utilities to stack form elements and adjust margins.

```html
<form class="sm-col-6">
  <label>Email Address</label>
  <input type="text" class="block full-width mb1 field-light">
  <label>Password</label>
  <input type="password" class="block full-width mb1 field-light">
  <label>Select</label>
  <select class="block full-width mb1 field-light">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
    <option>Option 4</option>
    <option>Option 5</option>
  </select>
  <label class="block full-width mb2">
    <input type="checkbox" checked>
    Remember me
  </label>
  <button type="submit" class="button">Sign In</button>
  <button type="reset" class="button bg-gray">Cancel</button>
</form>
```

## Fieldsets
Fieldset styles can be reset with `.fieldset-reset` to customize the appearance with other utilities.

```html
<form class="sm-col-6">
  <fieldset class="fieldset-reset">
    <legend class="h3 bold">Fieldset Legend</legend>
    <label>Hamburger</label>
    <input type="text" class="block full-width mb1 field-light">
    <label>Hot Dog</label>
    <input type="text" class="block full-width mb1 field-light">
  </fieldset>
  <button type="sumbit" class="button">Submit</button>
</form>
```

To adjust the color of forms, use the styles in `basscss-color-forms` and `basscss-color-forms-dark`.

