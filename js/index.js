const IMAGE_HEIGHT = 28;
const IMAGE_WIDTH = 28;
const IMAGE_SIZE = IMAGE_HEIGHT * IMAGE_WIDTH;


/*
 * Load Model
 */

const MNIST_MODEL_PATH = '/model/model.json';

function loadModel() {
    return tf.loadModel(MNIST_MODEL_PATH);
}

function predict(model, imageData) {
    console.log(imageData);
    const image = tf.fromPixels(imageData);
    const input = image
        // RGBA to grey
        .max(2)
        // Convert to float32. tf.js doesn't do implicit conversion
        .cast('float32')
        // Convert int to float between 0 to 1
        .div(tf.tensor(255.))
        // Prepare input for prediction 
        .reshape([-1, IMAGE_HEIGHT * IMAGE_WIDTH]);
    const prediction = model.predict(input).argMax(1);
    return prediction.dataSync();
}

function classesFromLabels(y) {
    return Array.from(tf.tensor(y).reshape([-1, 10]).argMax(1).dataSync());
}

/*
 * Load data
 */

const MNIST_IMAGES_SPRITE_PATH = '/js/assets/mnist_images.png';
const MNIST_LABELS_PATH = '/js/assets/mnist_labels_uint8';
const NUM_DATASET_ELEMENTS = 1000;

function loadData() {
    loadImg = (img, done) => {
        const canvas = document.createElement('canvas');
        canvas.width = IMAGE_SIZE;
        canvas.height = NUM_DATASET_ELEMENTS;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.naturalWidth, NUM_DATASET_ELEMENTS);
        done(imageData);
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = '';
        img.onload = () => loadImg(img, resolve);
        img.src = MNIST_IMAGES_SPRITE_PATH;
    });
}

function loadLabels() {
    return fetch(MNIST_LABELS_PATH);
}

/*
 * Display
 */

// For testing
function drawImageData(imageData) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    document.body.appendChild(canvas);
    for (let i = 0; i < imageData.height; ++i) {
        const canvas = document.createElement('canvas');
        draw(canvas, imageData, i, IMAGE_WIDTH, IMAGE_HEIGHT);
        document.body.appendChild(canvas);
    }
}

function draw(canvas, src, start, width, height) {
    canvas.width = width;
    canvas.height = height;
    const size = width * height * 4;
    const p = start * size;

    const imageData = new ImageData(width, height);
    for (let i = 0; i < size; ++i) {
        imageData.data[i] = src.data[p + i];
    }
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
}

function showResults(image, labels, predictions) {
    for (let i = 0; i < predictions.length; ++i) {
        const title = document.createElement('div')
        title.className = (predictions[i] == labels[i]) ?
            'pred-correct' : 'pred-incorrect';
        title.innerHTML = `pred: ${predictions[i]} label: ${labels[i]}`;

        const canvas = document.createElement('canvas');
        draw(canvas, image, i, IMAGE_WIDTH, IMAGE_HEIGHT);

        const container = document.createElement('div');
        container.className = 'pred-container';
        container.appendChild(title);
        container.appendChild(canvas);
        document.body.appendChild(container);
    }
}


/* 
 * Main logic
 */

function main() {
    Promise.all([
        loadData(), loadLabels(), loadModel()
    ]).then(
        ([image, labelFileResponse, model]) => {
            // All inputs are ready by now.
            const predictions = predict(model, image);
            labelFileResponse.arrayBuffer().then((labelsRes) => {
                const labels = classesFromLabels(new Uint8Array(labelsRes));
                showResults(image, labels, predictions);
            })
        }
    )
}

/*
 * Execute
 */
main();