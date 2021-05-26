# JSGetImageAsDataURL

Simple ES6 library for browser to get base64 encoded images from the user just in one line:

```js
const base64Image = await getImageAsDataURL();
```

Also, images are cropped/zoomed to the specified size.

This library is useful to get avatar from user in one line of code and then send it with other data in JSON.

## Docs

```js
/**
 * Opens user file selection (with filter to images) dialog and returns dataURL of selected image
 * image is cropped to the specified size
 *
 * @param {number} size size to fit image in (square size x size), if null => dataUrl with the size of an image
 * @param {object} accept list with allowed mime types
 * @param {number} maxFileSizeMB maximum allowed file size
 * @returns {string} Data url of image selected by user
 */
export const getImageAsDataURL = async (
    size = 256,
    accept = ['image/png', 'image/jpeg', 'image/bmp'],
    maxFileSizeMB = 5,
) => {
    ...
}
```

## Complete usage

To actually use this function you need an action from user. Otherwise browser will not allow it to run. So the complete example looks like this:

```html
<div>
    <img id="image" src="" alt="No image">
</div>
<button id="btnCrop">Upload and crop image</button>
<button id="btnLoad">Upload image</button>

<script type="module">
    import getImageAsDataURL from './getImageAsDataURL.js';

    btnCrop.addEventListener('click', async function () {
        image.src = await getImageAsDataURL();
    });
    btnLoad.addEventListener('click', async function () {
        image.src = await getImageAsDataURL(0);
    });
</script>
```

This page needs to be served, not opened as a file, because browser doesn't allow importing scripts if page is opened as a file.
