import {
  createRouter,
  createWebHistory,
} from "vue-router";

import SignUp from '@/views/SignUp';
import LogIn from '@/views/Login/LogIn';
import UserPage from '@/views/UserPage';
import PostPage from '@/views/PostPage';
import FilesPage from '@/views/FilesPage';
import SettingsPage from '@/views/SettingsPage';

import Page404 from '@/views/Page404_2';

import UserPage2 from '@/views/OtherUserPage';

import MenuModal from '@/components/MenuModal';
import PostCard from '@/components/PostCard';
import PostCreatorForm from '@/components/PostCreatorForm';
import Gallery from '@/components/Gallery';
import GalleryModal from '@/components/GalleryModal';

const routes = [{
    path: '/',
    name: 'UserPage',
    component: UserPage
  },
  {
    path: '/files',
    name: 'FilesPage',
    component: FilesPage
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    component: SettingsPage
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/login',
    name: 'LogIn',
    component: LogIn
  },
  {
    path: '/posts/:id',
    name: 'PostPage',
    component: PostPage
  },
  {
    path: '/404',
    name: 'Page404',
    component: Page404,
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: Gallery,
  },
  {
    path: '/gallery3',
    name: 'GalleryModal',
    component: GalleryModal,
  },
  {
    path: '/menu',
    name: 'Menu',
    component: MenuModal,
  },
  {
    path: '/create',
    name: 'PostCreatorForm',
    component: PostCreatorForm,
  },
  {
    path: '/postcard',
    name: 'PostCard',
    component: PostCard,
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;