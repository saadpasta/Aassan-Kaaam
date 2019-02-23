import { categoryConstant } from "../constants";

export const category = (state = {}, action) => {
  switch (action.type) {
    case categoryConstant.CATEOGRY_REQUEST: {
      return (state = {
        user: action.data
      });
    }

    case categoryConstant.CATEOGRY_SUCCESS: {
      return (state = {
        data: action.data
      });
    }

    case categoryConstant.CATEOGRY_FAILURE: {
      return (state = {
        error: action.error
      });
    }

    default:
      return (state = {});
  }
};
