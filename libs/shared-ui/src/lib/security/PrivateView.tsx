import { Roles, User } from '@mecaesparza/shared-data';
import { useRouter } from 'next/router';
import { useAuth } from '../auth/useAuth';
import { Loading } from '../utils/Loading';

interface IProps {
	children: JSX.Element;
}

export function PrivateView(props: IProps) {
	const { children } = props;
	const { push, pathname } = useRouter();
	const { GetUserContext } = useAuth();

	if (GetUserContext.loading) return <Loading />;

	if (GetUserContext.user && canAcces(GetUserContext.user, pathname)) return children;

	return null;
}

interface IUseCasesPermissions {
	[propName: string]: { icon: JSX.Element | null; subItems: { name: string; url: string; permissions: Roles[] }[] };
}

export const UseCasesPermissions: IUseCasesPermissions = {
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

export function canAcces(user: User, pathname: string): boolean {
	const props = Object.keys(UseCasesPermissions);
	return props.some((p) => UseCasesPermissions[p].subItems.some((sub) => sub.url === pathname && sub.permissions.some((p) => p === user.role)));
}

export function getTitle(pathname: string): string | null {
	const props = Object.values(UseCasesPermissions);
	const useCasesPermissions = props.find((i) => i.subItems.some((e) => e.url === pathname));

	const useCasesPermissionsSubItem = useCasesPermissions ? useCasesPermissions.subItems.find((f) => f.url === pathname) : null;

	if (!useCasesPermissionsSubItem) {
		return null;
	}

	return useCasesPermissionsSubItem.name;
}
