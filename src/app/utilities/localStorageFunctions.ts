export const saveToLocalStorage = (key, value) =>
    window.localStorage.setItem(key, value);

export const getFromLocalStorage = (key) => window.localStorage.getItem(key);

export const removeFromLocalStorage = (key) =>
    window.localStorage.removeItem(key);
