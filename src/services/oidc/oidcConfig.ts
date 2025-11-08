import { UserManagerSettings } from 'oidc-client-ts';
import {
  OIDC_AUTHORITY,
  OIDC_CLIENT_ID,
  OIDC_CLIENT_SECRET,
  OIDC_REDIRECT_URI,
  OIDC_POST_LOGOUT_REDIRECT_URI,
  OIDC_SCOPES,
} from '@/config/environment';

export const oidcConfig: UserManagerSettings = {
  authority: OIDC_AUTHORITY,
  client_id: OIDC_CLIENT_ID,
  client_secret: OIDC_CLIENT_SECRET || undefined,
  redirect_uri: OIDC_REDIRECT_URI,
  post_logout_redirect_uri: OIDC_POST_LOGOUT_REDIRECT_URI,
  response_type: 'code', // Authorization Code Flow
  scope: OIDC_SCOPES,
  
  // Automatic token refresh
  automaticSilentRenew: true,
  silent_redirect_uri: `${window.location.origin}/silent-renew.html`,
  
  // Token expiration notification
  accessTokenExpiringNotificationTimeInSeconds: 60, // 60 seconds before expiration
  
  // PKCE (Proof Key for Code Exchange)
  // Automatically enabled with response_type: 'code'
  
  // Storage
  userStore: undefined, // Will use default localStorage
  
  // Metadata
  loadUserInfo: true,
  
  // Filter protocol claims from profile
  filterProtocolClaims: true,
};

