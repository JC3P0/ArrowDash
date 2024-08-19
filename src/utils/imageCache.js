// src/utils/imageCache.js
const DB_NAME = 'imageCacheDB';
const STORE_NAME = 'images';

export async function loadAndCacheImage(url) {
    const db = await openDB();
    const cachedImage = await getImageFromCache(db, url);
    if (cachedImage) {
        return cachedImage;
    }

    const imageBlob = await fetchImage(url);
    await storeImageInCache(db, url, imageBlob);
    return imageBlob;
}

async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = () => {
            const db = request.result;
            db.createObjectStore(STORE_NAME);
        };
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function getImageFromCache(db, url) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(url);

        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function storeImageInCache(db, url, imageBlob) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(imageBlob, url);

        request.onsuccess = () => {
            resolve();
        };
        request.onerror = () => {
            reject(request.error);
        };
    });
}

async function fetchImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return await convertBlobToBase64(blob);
}

function convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
    });
}
