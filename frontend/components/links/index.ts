import { HomeLink } from './common';
import { SignInLink, SignUpLink } from './auth-links';
import { MessCreate, MessDashboard, MessLink } from './mess.links';

export const Links = {
  Home: HomeLink,

  SignUp: SignUpLink,
  SignIn: SignInLink,

  Mess: MessLink,
  CreateMess: MessCreate,
  Dashboard: MessDashboard,
};
