import Axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { ViewModel } from '@mecaesparza/shared-data';
import { useAuth } from '../auth/useAuth';
import { useNotification } from '../notification/useNotification';

export const useApiManager = () =>
{
    const { showNotificationFail } = useNotification();
    const { GetTokenUser } = useAuth();

    const axios: AxiosInstance = Axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL_BASE
    });

    async function CreateRequestConfig (): Promise<AxiosRequestConfig>
    {
        const requestConfig: AxiosRequestConfig = {};

        await SetTokenRequest(requestConfig);

        return requestConfig;
    }

    async function SetTokenRequest (requestConfig: AxiosRequestConfig): Promise<void>
    {

        const token = await GetTokenUser();

        Object.assign(requestConfig, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    async function Get<ResponseDataType> (
        controllerName: string,
        actionName: string
    ): Promise<ResponseDataType>
    {

        const requestConfig = await CreateRequestConfig();

        return new Promise((resolve, reject) =>
        {
            axios.get<ResponseDataType>(`/${controllerName}/${actionName}`, requestConfig)
                .then(response =>
                {
                    return resolve(response.data)
                })
                .catch(error =>
                {
                    HandleError(error);
                    return reject(error)
                })
        })

        // try {
        // 	const { data } = await axios.get<ResponseDataType>(`/${controllerName}/${actionName}`, requestConfig);
        // 	return data;
        // } catch (error) {
        // 	HandleError(error)
        // }
    }

    async function Post<ResponseDataType> (
        controllerName: string,
        actionName: string,
        body: ViewModel
    ): Promise<ResponseDataType | null>
    {

        const requestConfig = await CreateRequestConfig();

        try
        {
            const { data } = await axios.post<ResponseDataType>(`/${controllerName}/${actionName}`, body, requestConfig);
            return data;
        } catch (error)
        {
            if (Axios.isAxiosError(error))
            {
                HandleError(error as AxiosError<IExceptionResponse>)
            } else
            {
                showNotificationFail((error as Error).message)

            }
            return null;
        }
    }

    interface IExceptionResponse
    {
        status: number;
        timestamp: string;
        url: string;
        message: string
    }

    function HandleError (error: AxiosError<IExceptionResponse>)
    {
        if (error.response)
        {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            showNotificationFail(error.response.data.message)
        } else if (error.request)
        {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            showNotificationFail(error.message)
        } else
        {
            // Something happened in setting up the request that triggered an Error
            // console.log('Error', error.message);
            showNotificationFail(error.message)

        }
    }

    return {
        Get,
        Post
    };
};
