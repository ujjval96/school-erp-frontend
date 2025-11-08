import { UserManager, User } from 'oidc-client-ts';
import { oidcConfig } from './oidcConfig';

// Create UserManager instance
export const userManager = new UserManager(oidcConfig);

// Event handlers
userManager.events.addUserLoaded((user: User) => {
  console.log('✅ OIDC: User loaded', user.profile);
});

userManager.events.addUserUnloaded(() => {
  console.log('👋 OIDC: User unloaded');
});

userManager.events.addAccessTokenExpiring(() => {
  console.log('⏰ OIDC: Access token expiring, refreshing...');
});

userManager.events.addAccessTokenExpired(() => {
  console.log('❌ OIDC: Access token expired');
});

userManager.events.addSilentRenewError((error) => {
  console.error('❌ OIDC: Silent renew error', error);
});

userManager.events.addUserSignedOut(() => {
  console.log('👋 OIDC: User signed out');
});

/**
 * OIDC Helper Functions
 */

export async function getUser(): Promise<User | null> {
  try {
    const user = await userManager.getUser();
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function login(): Promise<void> {
  try {
    await userManager.signinRedirect();
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}

export async function handleCallback(): Promise<User> {
  try {
    const user = await userManager.signinRedirectCallback();
    console.log('✅ OIDC: Callback handled successfully');
    return user;
  } catch (error) {
    console.error('Error handling callback:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await userManager.signoutRedirect();
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
}

export async function refreshToken(): Promise<User | null> {
  try {
    const user = await userManager.signinSilent();
    console.log('✅ OIDC: Token refreshed');
    return user;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    const user = await userManager.getUser();
    return user?.access_token || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

