import { HomeLink } from './common';
import { SignInLink, SignUpLink } from './auth-links';
import {
  DataEntryLink,
  CurrentMonthLink,
  MemberBalancesLink,
  MembersLink,
  PeriodsLink,
  HistoryLink,
  SettingsLink,
  MessLink,
  MessCreate,
  MessDashboard,
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
  DataEntry: DataEntryLink,
  CurrentMonth: CurrentMonthLink,
  MemberBalances: MemberBalancesLink,
  Members: MembersLink,
  Periods: PeriodsLink,
  History: HistoryLink,
  Settings: SettingsLink,
};
