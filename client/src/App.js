import {createBrowserRouter, Route, createRoutesFromElements, RouterProvider, Navigate, useLocation} from 'react-router-dom'
//layouts
import HistoryLayout from './layouts/HistoryLayout.js';
//pages
import HomePage, {HomeUserDecode} from './pages/HomePage.js';
import FavoritesPage from './pages/FavoritesPage';
import PostPage from './pages/PostPage.js';
import PostApplyPage from './pages/PostApplyPage.js';
import OrgProfilePage from './pages/OrgProfilePage.js';
import UserProfilePage from './pages/UserProfilePage.js';
import {LoginPage, UserLoginPage, OrgLoginPage} from './pages/LoginPage.js';
import {Register, RegisterUserStep1, RegisterUserStep2, RegisterUserStep3, RegisterUserStep4, RegisterUserDecode, RegisterOrgStep1, RegisterOrgStep2, RegisterOrgStep3, RegisterOrgStep4, RegisterOrgStep5 } from './pages/RegisterPage.js';
import OrgPostsPage from './pages/OrgPostsPage.js'
import {CreatePostStep1, CreatePostStep2, CreatePostStep3} from './pages/CreatePostPage.js'
import MyPostsPage from './pages/myPostsPage';
import ApplicationsPage from './pages/ApplicationsPage.js'




import Test from './pages/test.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path='test' element={<Test/>}/>
      <Route path='/' element={<HomePage />} />
      <Route path='/home/user/decode' element={<HomeUserDecode />}/>
      
      <Route path='/favorites' element={<FavoritesPage />}/>

      <Route path='/history' element={<HistoryLayout />} />

      <Route path='/posts/:postId' >
        <Route index element={<PostPage/>}/>
        <Route path='applications' element={<ApplicationsPage/>}/>
      </Route>
      <Route path='/posts/apply/:postId' element={<PostApplyPage/>}></Route>

      <Route path='/orgs/:orgId' element={<OrgProfilePage/>}></Route>

      <Route path='/profile' element={<UserProfilePage/>}/>
      <Route path='/profile'>
        <Route index element={<UserProfilePage />} />
        <Route path={'posts'} element={<OrgPostsPage />} />
        <Route path={'addPost'}>
          <Route index element={<Navigate to='step1'/>} />
          <Route path='step1' element={<CreatePostStep1/>} />
          <Route path='step2' element={<CreatePostStep2/>} />
          <Route path='step3' element={<CreatePostStep3/>} />
        </Route>
      </Route>

      <Route path='/myPosts' element={<MyPostsPage/>}/>

      <Route path='/login'>
        <Route index element={<LoginPage />}/>
        <Route path='user' element={<UserLoginPage />}/>
        <Route path='org' element={<OrgLoginPage />}/>
      </Route>

      <Route path='/register'>

        <Route index element={<Register/>}/>
        <Route path='user'>
          <Route path='decode' element={<RegisterUserDecode />}/>
          <Route path='step1' element={<RegisterUserStep1/>} />
          <Route path='step2' element={<RegisterUserStep2/>} />
          <Route path='step3' element={<RegisterUserStep3/>} />
          <Route path='step4' element={<RegisterUserStep4/>} />
        </Route>

        <Route path='org'>
          <Route path='step1' element={<RegisterOrgStep1/>} />
          <Route path='step2' element={<RegisterOrgStep2/>} />
          <Route path='step3' element={<RegisterOrgStep3/>} />
          <Route path='step4' element={<RegisterOrgStep4/>} />
          <Route path='step5' element={<RegisterOrgStep5/>} />
        </Route>

      </Route>
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
