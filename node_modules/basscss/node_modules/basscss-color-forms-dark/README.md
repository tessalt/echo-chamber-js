
This module sets basic color styles for form elements on dark backgrounds.

## Input Fields

To style the color, background, and border styles for form fields on dark backgrounds, use the `.field-dark` style.
This style works on text inputs, selects, and textareas.

```html
<form class="p2 white bg-black">
  <label>Input</label>
  <input type="text" class="block full-width field-dark">
  <label>Select</label>
  <select class="block full-width field-dark">
    <option value="1">One</option>
    <option value="2">Two</option>
    <option value="3">Three</option>
  </select>
  <label>Textarea</label>
  <textarea class="block full-width field-dark"></textarea>
</form>
```

The `.field-dark` style includes states for disabled and read-only fields, as well as success, warning, and error states.

```html
<form class="p2 white bg-black">
  <label>Normal</label>
  <input type="text" class="block full-width field-dark">
  <label>Disabled</label>
  <input type="text" class="block full-width field-dark" disabled value="This is disabled">
  <label>Read Only</label>
  <input type="text" class="block full-width field-dark" readonly value="This is read-only">
  <label>Required</label>
  <input type="text" class="block full-width field-dark" required>
  <label>Success</label>
  <input type="text" class="block full-width field-dark is-success">
  <label>Warning</label>
  <input type="text" class="block full-width field-dark is-warning">
  <label>Error</label>
  <input type="text" class="block full-width field-dark is-error">
</form>
```

