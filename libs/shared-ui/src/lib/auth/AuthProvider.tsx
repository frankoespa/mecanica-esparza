import { Roles, User, UserContext } from '@mecaesparza/shared-data';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { Loading } from '../utils/Loading';

export const AuthContext = createContext<UserContext>({
    user: null,
    loading: true
});

interface IProps
{
    children: JSX.Element | JSX.Element[];
    usesCases: IUseCasesPermissions
}

export const AuthProvider = (props: IProps) =>
{
    const { children } = props;
    const { push, pathname } = useRouter();
    const [userContext, setUserContext] = useState<UserContext>({
        user: null,
        loading: true
    });

    if (!getApps().length)
    {
        initializeApp({
            apiKey: process.env.NEXT_PUBLIC_APIKEY_FIREBASE,
            projectId: 'mecanicaesparza-test',
            appId: '1:232005837121:web:b75f81770788bc501441c0'
        });
    }

    const AUTH_FIREBASE = getAuth(getApp());
    AUTH_FIREBASE.languageCode = 'es';

    useEffect(() =>
    {
        const authStateChanged = onAuthStateChanged(AUTH_FIREBASE, (user) =>
        {
            if (user)
            {
                console.log('EXISTS USER');

                user.getIdTokenResult().then(({ claims }) =>
                {
                    const uid = user.uid;
                    const role: Roles = parseInt(claims.role as string);
                    setUserContext({
                        user: { uid, role },
                        loading: false
                    });
                });
            } else
            {
                console.log('NOT USER');

                setUserContext({
                    user: null,
                    loading: false
                });
                push('/auth/login');
            }
        });

        return authStateChanged;
    }, []);

    if (userContext.loading)
        return (
            <AuthContext.Provider value={ { user: userContext.user, loading: userContext.loading } }>
                <Loading />;
            </AuthContext.Provider>
        );

    if (userContext.user && canAcces(userContext.user, pathname))
        return (
            <AuthContext.Provider value={ { user: userContext.user, loading: userContext.loading } }>
                { children }
            </AuthContext.Provider>);

    if (userContext.user && !canAcces(userContext.user, pathname))
        return (
            <AuthContext.Provider value={ { user: userContext.user, loading: userContext.loading } }>
                No tiene permiso
            </AuthContext.Provider>);

    return null;
};

interface IUseCasesPermissions
{
    [propName: string]: { icon: JSX.Element | null; subItems: { name: string; url: string; permissions: Roles[] }[] };
}

const UseCasesPermissions: IUseCasesPermissions = {
    // Trabajos: {
    // 	icon: <BuildIcon />,
    // 	subItems: []
    // },
    // Usuarios: {
    // 	icon: <UserIcon />,
    // 	subItems: [
    // 		{
    // 			name: 'Administrar',
    // 			url: '/dashboard/usuarios/administrar',
    // 			permissions: [Roles.Admin]
    // 		}
    // 	]
    // },
    // Vehiculos: {
    // 	icon: <CarIcon />,
    // 	subItems: []
    // },
    // Servicios: {
    // 	icon: <ServicioIcon />,
    // 	subItems: []
    // },
    // Repuestos: {
    // 	icon: <RepuestoIcon />,
    // 	subItems: []
    // },
    // Informes: {
    // 	icon: <InformeIcon />,
    // 	subItems: []
    // }
};

export function canAcces (user: User, pathname: string): boolean
{
    const props = Object.keys(UseCasesPermissions);

    return props.some((p) => UseCasesPermissions[p].subItems.some((sub) => sub.url === pathname && sub.permissions.some((p) => p === user.role))) || !props.some((p) => UseCasesPermissions[p].subItems.some((sub) => sub.url === pathname))
}

export function getTitle (pathname: string): string | null
{
    const props = Object.values(UseCasesPermissions);
    const useCasesPermissions = props.find((i) => i.subItems.some((e) => e.url === pathname));

    const useCasesPermissionsSubItem = useCasesPermissions ? useCasesPermissions.subItems.find((f) => f.url === pathname) : null;

    if (!useCasesPermissionsSubItem)
    {
        return null;
    }

    return useCasesPermissionsSubItem.name;
}
