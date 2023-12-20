import { AxiosRequestConfig } from "axios";
import { useState, useEffect } from "react";
import { ApiContext } from "./context";

export default function ApiProvider({ children }: { children: React.ReactElement }) {
	const [token, setToken] = useState<string | null>(null);
	const [ready, setReady] = useState<boolean>(false);
	const axios: AxiosRequestConfig = {
		baseURL: "http://bbupdater.beyondbytes.co.uk",
		headers: { Authorization: token !== null ? `Bearer ${token}` : null },
	};

	// Pobieranie tokena z localStorage
	useEffect(() => {
		const myToken = localStorage.getItem("token");
		setToken(myToken);
		setReady(true);
	}, []);

	return (
		<ApiContext.Provider value={{ config: axios, setToken: setToken, token: token }}>
			{ready ? children : <></>}
		</ApiContext.Provider>
	);
}
