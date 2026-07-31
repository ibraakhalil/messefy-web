import { HomeLink } from './common';
import { SignInLink, SignUpLink } from './auth-links';
import {
  CurrentMonthLink,
  MemberBalancesLink,
  MembersLink,
  SettingsLink,
  MessLink,
  MessCreate,
  MessDashboard,
  InvitationsLink,
  AllMonthsLink,
} from './mess.links';

export const Links = {
  // Common
  Home: HomeLink,

  // Auth
  SignUp: SignUpLink,
  SignIn: SignInLink,

  // Mess
  Mess: MessLink,
  CreateMess: MessCreate,
  Dashboard: MessDashboard,
  Invitations: InvitationsLink,
  CurrentMonth: CurrentMonthLink,
  AllMonths: AllMonthsLink,
  MemberBalances: MemberBalancesLink,
  Members: MembersLink,
  Settings: SettingsLink,
};
