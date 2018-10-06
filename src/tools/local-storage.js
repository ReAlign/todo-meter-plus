const _getData = (key) => {
    try {
        console.log(localStorage);
        const serializedData = localStorage.getItem(key);
        return JSON.parse(serializedData);
    } catch (err) {
        return null;
    }
};

const _setData = (key, data) => {
    try {
        console.log(localStorage);
        const serializedData = JSON.stringify(data);
        localStorage.setItem(key, serializedData);
    } catch (err) {
        console.error(err);
    }
};

export const loadState = () => _getData('state');
export const saveState = state => _setData('state', state);
export const getData = (key) => _getData(key);
export const setData = (key, data) => _setData(key, data);