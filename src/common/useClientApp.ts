import { useApi } from "../context/api/hook";
import { ClientAppDataType } from "./useCreate";

export const useClientApp = () => {
	const { get } = useApi();

	// pobranie danych o aplikacji
	async function clientApp(id: number) {
		try {
			const res = await get<ClientAppDataType>(`/client_apps/${id}`);
			return res;
		} catch (e) {
			console.log(e);
		}
	}

	return { clientApp };
};
