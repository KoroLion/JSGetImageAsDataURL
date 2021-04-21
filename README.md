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
 * @param {string} accept string with allowed mime types divided by coma
 * @param {number} size size of resulting image (square size x size)
 * @param {number} maxFileSizeMB maximum allowed file size
 * @returns {string} Data url of image selected by user
 */
export const getImageAsDataURL = async (
    accept = 'image/png, image/jpeg, image/bmp',
    size = 256,
    maxFileSizeMB = 10
) => {
    ...
}
```

## Complete usage

To actually use this function you need an action from user. Otherwise browser will not allow it to run. So the complete example looks like this:

```html
<html>
<head>
    <title>Example</title>
    <meta charset="utf-8">
</head>
<body>
    <div>
        <img id="image" src="" alt="No image" style="width: 256px; height: 256px;">
    </div>
    <button id="btn">Upload image</button>

    <script type="module">
        import getImageAsDataURL from './getImageAsDataURL.js';

        btn.addEventListener('click', async function () {
            image.src = await getImageAsDataURL();
        });
    </script>
</body>
</html>
```

This page needs to be served, not opened as a file, because browser doesn't allow importing scripts if page is opened as a file.
