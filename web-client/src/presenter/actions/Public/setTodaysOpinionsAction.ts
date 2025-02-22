import { state } from '@web-client/presenter/app-public.cerebral';
/**
 * sets the state.todaysOpinions based on props.todaysOpinions
 *
 * @param {object} props the props object
 * @param {object} store the store object
 */
export const setTodaysOpinionsAction = ({ props, store }: ActionProps) => {
  store.set(state.todaysOpinions, props.todaysOpinions);
};
