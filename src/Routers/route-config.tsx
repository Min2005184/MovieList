import Review from '../pages/REVIEW/Review'
import RegisterationForm from '../forms/Register';
//import { SignUp } from '../pages/SignUp'
import AnimeList from '../pages/AnimeList';
//import LandingPage from '../pages/LandingPage'
import RedirectLandingPage from '../pages/RedirectLandingPage';
import SignIn from '../forms/SignIn'
import EditProfileCard from '../pages/UserProfile/EditProfile';
import CommentBox from '../pages/REVIEW/CommentBox';

const routes = [
    {
        path: "/",
        component: AnimeList
    },
    {
        path: "*",
        component: RedirectLandingPage
    },
    {
        path: '/movie/:id?',
        component: Review,
    },
    {
        path: '/animeList/:id?',
        component: AnimeList
    },
    {
        path: '/register',
        component: RegisterationForm,
    },
    {
        path: "/signin",
        component: SignIn  
    },
    {
        path: '/edit-profile/:email?',
        component: EditProfileCard
    },
    {
        path: '/commentbox/:id?',
        component: CommentBox
    },
    
    
]

export default routes
