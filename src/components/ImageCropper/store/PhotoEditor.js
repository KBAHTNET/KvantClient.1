export const PhotoEditor = ({
    state: {
        imgToSave: null,

    },
    mutations: {
        saveImg(state, newImg) {
            state.imgToSave = newImg;
        },
    },
});