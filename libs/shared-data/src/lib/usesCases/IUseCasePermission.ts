import {} from 'react';
import { Roles } from "../auth/Roles";

export interface IUseCasesPermissions
{
    [propName: string]: {
        icon: JSX.Element | null;
        subItems: {
            name: string;
            url: string;
            permissions: Roles[]
        }[]
    };
}