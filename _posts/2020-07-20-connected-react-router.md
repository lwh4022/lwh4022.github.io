---
layout: post
title: connected-react-router
categories: [Develop, React]
description: Connected-react-router '#1
tags: [React, Typescript]    
---

> https://hokeydokey.tistory.com/m/74?category=783109 블로그를 참조했습니다.


# 목적
history객체를 통해 Redux에서 주소를 변경 및 확인

# readme 내용
1. 단방향 흐름을 통해 Redux에서 router로 상태 전송 (history -> store -> router -> component)
2. react router 버전 v4, v5를 지원
3. 함수형 component를 지원
4. redux-thunk나 redux-saga를 통해 history 객체 dispatch 가능
5. immutable.js를 지원
6. Typescript 지원

# @reduxjs/toolkit에서 사용
```javascript
import { configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

export const history = createHashHistory();
const rootReducer = createRootReducer(history);
export type RootState = ReturnType<typeof rootReducer>;

const router = routerMiddleware(history);
const middleware = [...getDefaultMiddleware(), router];

export const configuredStore = (initialState?: RootState) => {
  // Create Store
  const store = configureStore({
    reducer: rootReducer,
    middleware,
    preloadedState: initialState,
  });
  return store;
};
```

#root파일에서 history객체 불러오기
## Provider -> connectedRouter -> App 순
```javascript
const Root = ({ store, history }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>
);
```

#Redux-thunk로 push 가능
```javascript
import { push } from 'connected-react-router';

const addArticleRequest = createAction(types.ADD_ARTICLE_REQUEST);
const addArticleSuccess = createAction(types.ADD_ARTICLE_SUCCESS);
const addArticleFailed = createAction(types.ADD_ARTICLE_FAILED);

export const addArticle = (whereCollection,title,content,file) =>{
    return (dispatch,getState) =>{
        dispatch(addArticleRequest());

        const state = getState();        
        const userId = state.auth.user.uid;
        const userDisplayName = state.auth.user.displayName;
        const userProfileUrl = state.auth.user.photoURL;
        //getState를 쓰면 현재 스토어의 스테이트를 알 수 있다. 
        ArticleAPI.addArticle({whereCollection,title,userId,content,file,userDisplayName,userProfileUrl})
        .then(()=>{
            dispatch(addArticleSuccess());
            dispatch(push(`/community/${whereCollection}`));
        }).catch((error)=>{
            dispatch(addArticleFailed(error));
        })
    }
}
```