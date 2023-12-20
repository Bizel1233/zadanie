import { useApi } from "../context/api/hook";

export type CreateClientAppBodyType = {
	version: string;
	url: string;
	fileName: string;
	md5: string;
	appName: string | null;
	description: string | null;
	launchArgs: string | null;
};

export type ClientAppDataType = {
	id: number;
	version: string;
	url: string;
	fileName: string;
	md5: string;
	appName: string;
	description: string | null;
	launchArgs: string | null;
	createdAt: string;
	createdBy: {
		email: string;
		username: string;
	};
	updatedAt: string | null;
	updatedBy: {
		email: string;
		username: string;
	} | null;
};

export const useCreate = () => {
	const { post } = useApi();

	// utworzenie nowej aplikacji
	async function createClientApp(data: CreateClientAppBodyType) {
		try {
			const res = await post<ClientAppDataType>(`/client_apps`, data);
			return res;
		} catch (e) {
			console.log(e);
		}
	}

	return { createClientApp };
};
