import { SET_TEST } from "../actions/TestActions";

export const testReducer = (state = {}, { type, payload }) => {

    switch (type) {
        case SET_TEST:
            return payload;
        default:
            return state;
    }
}