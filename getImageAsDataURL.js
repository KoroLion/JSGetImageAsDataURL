const DEFAULT_CROP_SIZE = 256;
const DEFAULT_COMPRESS_SIZE = 512;
const DEFAULT_ACCEPT = ['image/png', 'image/jpeg', 'image/bmp'];
const DEFAULT_MAX_FILE_SIZE_MB = 5;
const MB = 1024 * 1024;

const TEMP_EL_ID = 'filesImageInput';

const createCanvas = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    return { canvas, ctx };
};


const createImageInput = (changeCallback, accept) => {
    let hasInp = true;
    let imageInput = document.getElementById(TEMP_EL_ID);
    if (imageInput === null) {
        hasInp = false;
        imageInput = document.createElement('input');
    }
    imageInput.id = TEMP_EL_ID;
    imageInput.type = 'file';
    imageInput.accept = accept.join(', ');
    imageInput.addEventListener('change', changeCallback);

    imageInput.style.display = 'none';
    if (!hasInp) {
        document.body.appendChild(imageInput); // otherwise don't work on ios
    }

    return imageInput;
};

const getValidatedImage = (imageInput, maxFileSizeMB) => {
    if (imageInput.files.length !== 1) {
        throw new Error('Wrong amount of files!');
    }
    const file = imageInput.files[0];
    const typeSplitted = file.type.split('/');
    if (typeSplitted.length === 0 || typeSplitted[0] !== 'image') {
        throw new Error('File is not an image!');
    }
    if (file.size / MB > maxFileSizeMB) {
        throw new Error('File is bigger than allowed!');
    }

    return file;
};

const inputImageToDataURL = (inputImage, cropSize, compressSize, maxFileSizeMB) => {
    return new Promise((resolve, reject) => {
        let image;
        try {
            image = getValidatedImage(inputImage, maxFileSizeMB);
        } catch (err) {
            reject(err);
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', (e) => {
            const dataUrl = e.target.result;

            if (!cropSize && !compressSize) {
                resolve(dataUrl);
                return;
            }

            const img = new Image();
            img.src = dataUrl;
            img.addEventListener('load', () => {
                if (cropSize) {
                    const imgMinSize = Math.min(img.width, img.height);

                    const {canvas, ctx} = createCanvas(cropSize, cropSize);
                    ctx.drawImage(img, 0, 0, imgMinSize, imgMinSize, 0, 0, canvas.width, canvas.height);

                    const dataURL = canvas.toDataURL();
                    canvas.remove();

                    img.src = dataURL;
                    img.height = img.width = Math.min(cropSize, imgMinSize);
                }

                if (compressSize) {
                    const imgMinSize = Math.min(img.width, img.height);
                    if (imgMinSize > compressSize) {
                        const percents = imgMinSize / compressSize;
                        const newWidth = img.width / percents;
                        const newHeight = img.height / percents;

                        const {canvas, ctx} = createCanvas(newWidth, newHeight);
                        ctx.drawImage(img, 0, 0, newWidth, newHeight);

                        const dataURL = canvas.toDataURL();
                        canvas.remove();

                        img.width = newWidth;
                        img.height = newHeight;
                        img.src = dataURL;
                    }
                }

                resolve(img.src);
            }, {once: true});
        }, {once: true});
        reader.addEventListener('error', (e) => {
            reject(new Error('Unable to read file!'));
        });
        reader.readAsDataURL(image);
    });
};

/**
 * Opens user file selection (with filter to images) dialog and returns dataURL of selected image
 * image is cropped to the specified size
 *
 * @param {number} cropSize size to fit image in (square size x size), if null => dataUrl with the size of an original image
 * @param {number} compressSize size to compress the longest side in, if null => dataUrl with the size of an original image
 * @param {object} accept list with allowed mime types
 * @param {number} maxFileSizeMB maximum allowed file size
 * @returns {Promise[string]} Data url of image selected by user
 */
export const getImageAsDataURL = async (
    cropSize = DEFAULT_CROP_SIZE,
    compressSize = DEFAULT_COMPRESS_SIZE,
    accept = DEFAULT_ACCEPT,
    maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
) => {
    return new Promise((resolve, reject) => {
        createImageInput(async ({ target }) => {
            try {
                const dataURL = await inputImageToDataURL(target, cropSize, compressSize, maxFileSizeMB);
                resolve(dataURL);
            } catch (err) {
                target.remove();
                reject(err);
            }
        }, accept).click();
    });
};


/**
 * Validate loaded (for example by drag-n-drop) image file and returns dataURL of selected image
 * image is cropped to the specified size
 *
 * @param {DataTransfer} dataTransfer data of all loaded files (you can get in using event.dataTransfer)
 * @param {number} cropSize size to fit image in (square size x size), if null => dataUrl with the size of an original image
 * @param {number} compressSize size to compress the longest side in, if null => dataUrl with the size of an original image
 * @param {number} maxFileSizeMB maximum allowed file size
 * @returns {string} Data url of image loaded by user
 */
export const getLoadedImageAsDataURL = async (
    dataTransfer,
    cropSize = DEFAULT_CROP_SIZE,
    compressSize = DEFAULT_COMPRESS_SIZE,
    maxFileSizeMB = DEFAULT_MAX_FILE_SIZE_MB,
) => {
    return inputImageToDataURL(dataTransfer, cropSize, compressSize, maxFileSizeMB);
};

export default getImageAsDataURL;
