import type { NitroFetchRequest } from 'nitropack'
import type { NitroFetchOptions } from 'nitropack';
import type { FetchOptions } from 'ofetch'


export default async function useApi<T>(path: NitroFetchRequest, opts?: FetchOptions) {
    const route = useRoute();

    const propsToAddToBody: Record<string, any> = {};

    const headers = import.meta.server ? useRequestHeaders() : {};
    const request: NitroFetchOptions<NitroFetchRequest, any> = {
        ...opts,

        headers: {
            ...headers,
            ...opts?.headers,
        },

        body: {
            ...propsToAddToBody,
            ...(opts?.body as Record<string, any>),
        },

        async onRequestError({ request, options, error }: { request: any; options: any; error: any }) {
            console.log(request, options, error);
        },

        async onResponse({ request, response, options }: { request: any; response: any; options: any }) {
            console.log('[fetch response]', request, response.status);
        },

        async onResponseError({ request, response, options }: { request: any; response: any; options: any }) {
            console.log('[fetch response error]', request, response.status, response.body);
        },
    };

    return $fetch<T>(path, request);
}
