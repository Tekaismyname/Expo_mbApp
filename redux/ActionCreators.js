import * as ActionTypes from "./ActionTypes";
import { baseUrl } from "../shared/baseUrl";

// leaders
export const fetchLeaders = () => (dispatch) => {
  dispatch(leadersLoading());
  setTimeout(() => {
    return fetch(baseUrl + "leaders")
      .then((response) => {
        if (!response.ok)
          throw Error("Error " + response.status + ": " + response.statusText);
        else return response.json();
      })
      .then((leaders) => dispatch(addLeaders(leaders)))
      .catch((error) => dispatch(leadersFailed(error.message)));
  }, 2000);
};
const leadersLoading = () => ({
  type: ActionTypes.LEADERS_LOADING,
});
const leadersFailed = (errmess) => ({
  type: ActionTypes.LEADERS_FAILED,
  payload: errmess,
});
const addLeaders = (leaders) => ({
  type: ActionTypes.ADD_LEADERS,
  payload: leaders,
});

// dishes
export const fetchDishes = () => (dispatch) => {
  dispatch(dishesLoading());
  setTimeout(() => {
    return fetch(baseUrl + "dishes")
      .then((response) => {
        if (!response.ok)
          throw Error("Error " + response.status + ": " + response.statusText);
        else return response.json();
      })
      .then((dishes) => dispatch(addDishes(dishes)))
      .catch((error) => dispatch(dishesFailed(error.message)));
  }, 2000);
};
const dishesLoading = () => ({
  type: ActionTypes.DISHES_LOADING,
});
const addDishes = (dishes) => ({
  type: ActionTypes.ADD_DISHES,
  payload: dishes,
});
const dishesFailed = (errmess) => ({
  type: ActionTypes.DISHES_FAILED,
  payload: errmess,
});

// comments
export const fetchComments = () => (dispatch) => {
  return fetch(baseUrl + "comments")
    .then((response) => {
      if (!response.ok)
        throw Error("Error " + response.status + ": " + response.statusText);
      else return response.json();
    })
    .then((comments) => dispatch(addComments(comments)))
    .catch((error) => dispatch(commentsFailed(error.message)));
};
const addComments = (comments) => ({
  type: ActionTypes.ADD_COMMENTS,
  payload: comments,
});
const commentsFailed = (errmess) => ({
  type: ActionTypes.COMMENTS_FAILED,
  payload: errmess,
});

//Comment
export const postComment = (dishId, rating, author, comment) => (dispatch) => {
  // Tạo comment object với thứ tự field chuẩn
  const newComment = {
    dishId: dishId,
    rating: rating,
    comment: comment,
    author: author,
    date: new Date().toISOString()
  };

  // POST comment lên server
  return fetch(baseUrl + 'comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newComment)
  })
  .then((response) => {
    if (!response.ok) {
      throw Error('Error ' + response.status + ': ' + response.statusText);
    }
    return response.json();
  })
  .then((responseComment) => {
    // Server trả về comment với ID đã được tạo
    // Dispatch comment này vào Redux store
    console.log('Comment posted successfully:', responseComment);
    
    // Delay 1 giây rồi thêm vào store (như yêu cầu bài tập)
    setTimeout(() => {
      dispatch(addComment(responseComment));
    }, 1000);
  })
  .catch((error) => {
    console.error('Post comment failed:', error.message);
    dispatch(commentsFailed(error.message));
    
    // Nếu lỗi, vẫn thêm comment vào Redux (offline mode)
    // Tạo ID tạm thời
    const offlineComment = {
      ...newComment,
      id: Date.now() // ID tạm thời
    };
    dispatch(addComment(offlineComment));
  });
};
const addComment = (comment) => ({
  type: ActionTypes.ADD_COMMENT,
  payload: comment
});
// =======


// promotions
export const fetchPromos = () => (dispatch) => {
  dispatch(promosLoading());
  setTimeout(() => {
    return fetch(baseUrl + "promotions")
      .then((response) => {
        if (!response.ok)
          throw Error("Error " + response.status + ": " + response.statusText);
        else return response.json();
      })
      .then((promos) => dispatch(addPromos(promos)))
      .catch((error) => dispatch(promosFailed(error.message)));
  }, 2000);
};


const promosLoading = () => ({
  type: ActionTypes.PROMOS_LOADING,
});
const addPromos = (promos) => ({
  type: ActionTypes.ADD_PROMOS,
  payload: promos,
});
const promosFailed = (errmess) => ({
  type: ActionTypes.PROMOS_FAILED,
  payload: errmess,
});


// favorites
export const postFavorite = (dishId) => (dispatch) => {
  dispatch(addFavorite(dishId));
};
const addFavorite = (dishId) => ({
  type: ActionTypes.ADD_FAVORITE,
  payload: dishId
});

export const deleteFavorite = (dishId) => ({
  type: ActionTypes.DELETE_FAVORITE,
  payload: dishId
});