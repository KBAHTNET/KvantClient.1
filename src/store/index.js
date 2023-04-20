import {
    createStore
} from "vuex";

import {
    PhotoEditor
} from "@/components/ImageCropper/store/PhotoEditor";

const store = createStore({
    state: () => {
        return {
            app: null,
            currentUser: {},
        }
    },
    mutations: {
        SetApp(state, newApp) {
            state.app = newApp;
        },
        SetCurrentUser(state, User) {
            state.currentUser = User;
        },
    },
    modules: {
        PhotoEditor
    }
});

export default store;