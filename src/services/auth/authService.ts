// authService.ts
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthResult {
  user: FirebaseAuthTypes.User;
  token: string;
}

const GOOGLE_SIGNIN_CONFIG = {
  webClientId: '1037505084112-9bvd7k0mhga4a5iked3v8q7gvrhbk89m.apps.googleusercontent.com',
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
    console.log(userCredential)

    return {
      user: userCredential.user,
      token: firebaseIdToken,
    };
  } catch (error: any) {
    if (error.code) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          throw new Error('Google Sign-in cancelled by user');
        case statusCodes.IN_PROGRESS:
          throw new Error('Google Sign-in already in progress');
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          throw new Error('Google Play Services not available');
        default:
          throw new Error(`Google Sign-in failed: ${error.message}`);
      }
    }
    console.error('Google login failed:', error);
    throw error;
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