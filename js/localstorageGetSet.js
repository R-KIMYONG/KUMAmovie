export const setLocalStorage = (where, value = 'test') => {
    const get = getLocalStorage(where);

    if(!get || value === 'test') {
        localStorage.setItem(where, value);
    }else {
        localStorage.setItem(where, value);
    }
}

export const getLocalStorage = (where) => {
    const get = localStorage.getItem(where);

    const parsed = JSON.parse(get);
    
    return parsed;
}