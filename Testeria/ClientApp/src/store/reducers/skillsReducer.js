import { CREATE_SKILLS, LOAD_SKILLS, REMOVE_SKILL } from "../actions/skillActions";

export const skillsReducer = (state = [], { type, payload }) => {

    switch (type) {
        case LOAD_SKILLS:
            return payload.map(s => ({id: s.id, label: s.name, value: s.name, count: s.count}));
        case CREATE_SKILLS:
            return [ ...state, ...payload.map(s => ({id: s.id, label: s.name, value: s.name})) ];
        case REMOVE_SKILL:
            return state.filter(s => s.id !== payload);
        default:
            return state;
    }
}