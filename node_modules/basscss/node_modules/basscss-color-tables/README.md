
This color module sets border styles for tables.

Use the `.table-light` style to add borders to tables.
Border color and width is set with the `--border-color` and `--border-width` custom properties.

```html
<div class="overflow-scroll">
  <table class="table-light">
    <thead>
      <tr>
        <th>Artist</th> <th>Album</th> <th>Release Date</th>
      </tr>
    </thead>
    <tbody>
      <tr> <td>Huey Lewis and the News</td> <td>Sports</td> <td>1983</td> </tr>
      <tr> <td>Phil Collins</td> <td>No Jacket Required</td> <td>1985</td> </tr>
      <tr> <td>Peter Gabriel</td> <td>So</td> <td>1986</td> </tr>
    </tbody>
  </table>
</div>
```

Use other color utilities to customize the look.

```html
<div class="overflow-scroll">
  <table class="table-light overflow-hidden bg-white border rounded">
    <thead class="bg-darken-1">
      <tr>
        <th>Artist</th> <th>Album</th> <th>Release Date</th>
      </tr>
    </thead>
    <tbody>
      <tr> <td>Huey Lewis and the News</td> <td>Sports</td> <td>1983</td> </tr>
      <tr> <td>Phil Collins</td> <td>No Jacket Required</td> <td>1985</td> </tr>
      <tr> <td>Peter Gabriel</td> <td>So</td> <td>1986</td> </tr>
    </tbody>
  </table>
</div>
```

