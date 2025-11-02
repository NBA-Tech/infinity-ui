// authService.ts
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { WEB_CLIENT_ID } from '@/src/config/app-config';

export interface AuthResult {
  user?: FirebaseAuthTypes.User;
  token?: string;
  error?: string;
}

const GOOGLE_SIGNIN_CONFIG = {
  webClientId: WEB_CLIENT_ID,
  offlineAccess: true,
  scopes: ['profile', 'email'], 
};

export function configureGoogleSignin(): void {
  try {
    GoogleSignin.configure({
      ...GOOGLE_SIGNIN_CONFIG,
      forceCodeForRefreshToken: true,
    });
  } catch (error) {
    console.error('Google Signin configuration failed:', error);
    throw new Error('Failed to configure Google Signin');
  }
}

export async function loginWithGoogle(): Promise<AuthResult> {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    await GoogleSignin.signOut();
    const userInfo = await GoogleSignin.signIn();
    const { idToken } = await GoogleSignin.getTokens();
    if (!idToken) {
      throw new Error('No ID token returned from Google Sign-in');
    }
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);

    const firebaseIdToken = await userCredential.user.getIdToken();

    return {
      user: userCredential.user,
      token: firebaseIdToken,
      error: ""
    };
  } catch (error: any) {
    console.log('Error logging in with Google:', error);
    return{
      token: "",
      user: undefined,
      error:"Something went wrong! Please try again."
    }
  }
}

export async function revokeGoogleAccess(): Promise<void> {
  try {
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    await auth().signOut();
  } catch (error: any) {
    console.error('Failed to revoke Google access:', error);
    throw new Error(`Logout failed: ${error.message}`);
  }
}

// Check if user is signed in
export async function isSignedIn(): Promise<boolean> {
  try {
    return await GoogleSignin.isSignedIn();
  } catch (error) {
    console.error('Error checking sign-in status:', error);
    return false;
  }
}