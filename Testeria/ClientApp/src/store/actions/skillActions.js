export const LOAD_SKILLS = 'LOAD_SKILLS';
export const CREATE_SKILLS = 'CREATE_SKILLS';
export const REMOVE_SKILL = 'REMOVE_SKILL';

export const loadSkillsAction = skills => ({ type: LOAD_SKILLS, payload: skills})

export const createSkillsAction = skills => ({ type: CREATE_SKILLS, payload: skills})

export const removeSkillAction = id => ({ type: REMOVE_SKILL, payload: id })