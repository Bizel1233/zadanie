import { ApiContext } from "./context";
import React from "react";
import axios, { AxiosError } from "axios";

export const useApi = () => {
	const apiContext = React.useContext(ApiContext);

	// ogólna funkcja do wysyłania zapytań typu POST do API, w razie 401 wyloguj użytkownika
	async function post<T>(url: string, data: any) {
		try {
			const res = await axios.post<T>(url, data, apiContext?.config);
			return res;
		} catch (e) {
			const error = e as AxiosError;
			if (error.response?.status === 401) {
				localStorage.removeItem("token");
				apiContext?.setToken(null);
			}
		}
	}

	// ogólna funkcja do wysyłania zapytań typu GET do API, w razie 401 wyloguj użytkownika
	async function get<T>(url: string) {
		try {
			const res = await axios.get<T>(url, apiContext?.config);
			return res;
		} catch (e) {
			const error = e as AxiosError;
			console.log(error);
			if (error.response?.status === 401) {
				localStorage.removeItem("token");
				apiContext?.setToken(null);
			}
		}
	}

	function setToken(token: string | null) {
		apiContext?.setToken(token);
	}

	return { post, get, setToken, token: apiContext?.token };
};
