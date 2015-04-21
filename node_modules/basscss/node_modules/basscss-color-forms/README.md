
This module sets basic color styles for form elements on a light background.

## Input Fields

To style the color, background, and border styles for form fields, use the `.field-light` style.
This style works on text inputs, selects, and textareas.

```html
<label>Input</label>
<input type="text" class="block full-width field-light">
<label>Select</label>
<select class="block full-width field-light">
  <option value="1">One</option>
  <option value="2">Two</option>
  <option value="3">Three</option>
</select>
<label>Textarea</label>
<textarea class="block full-width field-light"></textarea>
```

The `.field-light` style includes states for disabled and read-only fields, as well as success, warning, and error states.

```html
<label>Normal</label>
<input type="text" class="block full-width field-light">
<label>Disabled</label>
<input type="text" class="block full-width field-light" disabled value="This is disabled">
<label>Read Only</label>
<input type="text" class="block full-width field-light" readonly value="This is read-only">
<label>Required</label>
<input type="text" class="block full-width field-light" required>
<label>Success</label>
<input type="text" class="block full-width field-light is-success">
<label>Warning</label>
<input type="text" class="block full-width field-light is-warning">
<label>Error</label>
<input type="text" class="block full-width field-light is-error">
```

