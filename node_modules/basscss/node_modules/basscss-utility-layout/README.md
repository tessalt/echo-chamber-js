
Change the default document flow with these display, float, and other utilities.

## Display

To adjust the display of an element, use the `.block`, `.inline`, and `.inline-block` utilities.

```html
<div class="inline">inline</div>
<div class="inline-block">inline-block</div>
<a href="#" class="block">block</a>
```

## Overflow

To adjust element overflow, use `.overflow-hidden`, `.overflow-scroll`, and `.overflow-auto`. 
`.overflow-hidden` can also be used to create a new block formatting context or clear floats.

## Floats

Use `.clearfix`, `.left`, and `.right` to clear and set floats.

```html
<div class="clearfix border border-blue">
  <div class="left border border-blue">.left</div>
  <div class="right border border-blue">.right</div>
</div>
```

## Widths

Use `.fit` to set max-width 100%. `.full-width` and `.half-width` set widths to 100% and 50% respectively.

## Media Object
Create a media object using basic utilities.

```html
<div class="clearfix mb2 border border-blue">
  <div class="left p2 mr1 border border-blue">Image</div>
  <div class="overflow-hidden">
    <p><b>Body</b> Bacon ipsum dolor sit amet chuck prosciutto landjaeger ham hock filet mignon shoulder hamburger pig venison.</p>
  </div>
</div>
```

## Double-Sided Media Object
For a container with a flexible center, use a double-sided media object.

```html
<div class="clearfix mb2 border border-blue">
  <div class="left p2 mr1 border border-blue">Image</div>
  <div class="right p2 ml1 border border-blue">Image</div>
  <div class="overflow-hidden">
    <p><b>Body</b> Bacon ipsum dolor sit amet chuck prosciutto landjaeger ham hock filet mignon shoulder hamburger pig venison.</p>
  </div>
</div>
```

