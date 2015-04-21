# Basscss Table Object

<p class="hide">CSS layout module to vertically center elements for Basscss.</p>

<a href="http://basscss.com" class="hide">basscss.com</a>

Use the table object to vertically center content.
These styles can be combined with grid width and white-space utilities
for a wide range of layout options.
Apply padding to `.table-cell` elements to contol spacing.

```html
<div class="table outline-blue">
  <div class="table-cell">
    <h1 class="m0">.table-cell</h1>
    <p class="m0">For vertically centered content</p>
  </div>
  <div class="table-cell">.table-cell</div>
</div>
```

## Flag Object
The flag object can be emulated by adding `.full-width` to one of the cells.
To add padding to the body, nest another div within the full-width cell.

```html
<div class="table outline-blue">
  <div class="table-cell p2">Image</div>
  <div class="table-cell full-width">
    <h1 class="m0">Flag Body</h1>
    <p class="m0">The full-width utility makes the table object behave like the flag object.</p>
  </div>
</div>
```

## Equal width cells
Use the `.table-fixed` extension to create equal-width cells.

```html
<div class="table table-fixed outline-blue">
  <div class="table-cell">
    <h1 class="m0">.table-cell</h1>
    <p class="m0">For vertically centered content</p>
  </div>
  <div class="table-cell">.table-cell</div>
  <div class="table-cell">.table-cell</div>
</div>
```

## Responsive Table Object
Use breakpoint prefixes to keep table objects stacked at smaller screen sizes.
This is useful for things like navigation.

```html
<div class="sm-table mb1 outline-blue">
  <div class="sm-table-cell">
    <h1 class="m0">.sm-table-cell</h1>
    <p class="m0">Only kicks in above the small breakpoint</p>
  </div>
  <div class="sm-table-cell">.sm-table-cell</div>
</div>
<div class="lg-table outline-blue">
  <div class="lg-table-cell">
    <h1 class="m0">.lg-table-cell</h1>
    <p class="m0">Only kicks in above the large breakpoint</p>
  </div>
  <div class="lg-table-cell">.lg-table-cell</div>
</div>
```

## Table Grid
The table object can be combined with grid width utilities to create vertically centered columns.

```html
<div class="table outline-blue">
  <div class="table-cell col-7">
    <h1 class="m0">.table-cell.col-7</h1>
    <p class="m0">For vertically centered content</p>
  </div>
  <div class="table-cell col-5">.table-cell.col-5</div>
</div>
```

MIT License

