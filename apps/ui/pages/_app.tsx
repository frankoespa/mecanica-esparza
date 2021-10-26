import { AuthProvider, NotificationManager, ThemeConfig } from '@mecaesparza/shared-ui';
import { Roles } from '@mecaesparza/shared-data'
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppProps } from 'next/app';
import Head from 'next/head';
function App ({ Component, pageProps }: AppProps)
{
    return (
        <ThemeProvider theme={ThemeConfig}>
            <Head>
                <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no' />
            </Head>
            <NotificationManager>
                <CssBaseline />
                <AuthProvider usesCases={{
                    Trabajos: {
                        icon: null,
                        subItems: []
                    },
                    Usuarios: {
                        icon: null,
                        subItems: [
                            {
                                name: 'Administrar',
                                url: '/dashboard/usuarios/administrar',
                                permissions: [ Roles.Admin ]
                            }
                        ]
                    },
                    Vehiculos: {
                        icon: null,
                        subItems: []
                    },
                    Servicios: {
                        icon: null,
                        subItems: []
                    },
                    Repuestos: {
                        icon: null,
                        subItems: []
                    },
                    Informes: {
                        icon: null,
                        subItems: []
                    }
                }}>
                    <Component {...pageProps} />
                </AuthProvider>
            </NotificationManager>
        </ThemeProvider>
    );
}
export default App;
