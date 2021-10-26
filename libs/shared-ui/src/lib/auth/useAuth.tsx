import { UserSignin } from '@mecaesparza/shared-data';
import {
    ApplicationVerifier,
    AuthError,
    ConfirmationResult,
    getAuth,
    signInWithEmailAndPassword,
    signInWithPhoneNumber,
    signOut,
    User,
    UserCredential
} from 'firebase/auth';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { useNotification } from '../notification/useNotification';
import { AuthContext } from './AuthProvider';

declare global {
    interface Window {
        confirmationResult: ConfirmationResult;
    }
}

export const useAuth = () => {
    const { showNotificationFail } = useNotification();
    const { push } = useRouter();
    const AUTH_FIREBASE = getAuth();

    async function Logout() {
        await signOut( getAuth() );
    }

    function GetCurrentUser(): User | null {
        return AUTH_FIREBASE.currentUser;
    }

    async function RefreshClaims() {
        await AUTH_FIREBASE.currentUser?.getIdToken( true );
    }

    async function GetTokenUser(): Promise<string> {
        const userLogged = GetCurrentUser();

        if ( !userLogged ) throw new Error( 'There is not user logged' );

        const token = await userLogged.getIdToken();

        return token;
    }

    async function SignIn( userSignin: UserSignin ): Promise<UserCredential | null> {
        try
        {
            const userCredential = await signInWithEmailAndPassword( AUTH_FIREBASE, userSignin.Email, userSignin.Password );
            push( '/dashboard/usuarios/administrar' );
            return userCredential;
        } catch ( error )
        {
            AdminErrorsSignin( error as AuthError );
            return null;
        }
    }

    function AdminErrorsSignin( error: AuthError ) {
        const { code } = error;
        switch ( code )
        {
            case 'auth/wrong-password':
                showNotificationFail( 'Contraseña inválida' );
                break;
            case 'auth/invalid-email':
                showNotificationFail( 'Email inválido' );
                break;
            case 'auth/user-disabled':
                showNotificationFail( 'El usuario se encuentra desahabilitado' );
                break;
            case 'auth/user-not-found':
                showNotificationFail( 'El email no corresponde a un usuario existente' );
                break;
            default:
                break;
        }
    }

    // function AdminErrorsSignup(error: any) {
    // 	const { code } = error;
    // 	switch (code) {
    // 		case 'auth/email-already-in-use':
    // 			showNotificationFail('Contraseña inválida');
    // 			break;
    // 		case 'auth/invalid-email ':
    // 			showNotificationFail('Email inválido');
    // 			break;
    // 		case 'auth/operation-not-allowed':
    // 			showNotificationFail('El usuario se encuentra desahabilitado');
    // 			break;
    // 		case 'auth/weak-password':
    // 			showNotificationFail('El email no corresponde a un usuario existente');
    // 			break;
    // 		default:
    // 			break;
    // 	}
    // }

    // async function SignUp(userSignup: IUserSignup): Promise<firebase.auth.UserCredential> {
    // 	try {
    // 		return await firebaseAuth.createUserWithEmailAndPassword(userSignup.Email, userSignup.Password);
    // 	} catch (error) {
    // 		AdminErrorsSignup(error);
    // 	}
    // }

    async function SignInWithPhoneNumber( phoneNumber: string, appVerifierCaptcha: ApplicationVerifier ) {
        try
        {
            const confirmationResult = await signInWithPhoneNumber( AUTH_FIREBASE, phoneNumber, appVerifierCaptcha );
            window.confirmationResult = confirmationResult;
        } catch ( error )
        {
            showNotificationFail( ( error as AuthError ).message );
        }
    }

    return {
        Logout,
        GetCurrentUser,
        GetTokenUser,
        RefreshClaims,
        SignIn,
        GetUserContext: useContext( AuthContext ),
        SignInWithPhoneNumber
    };
};
