import { AxiosRequestConfig } from "axios";
import { createContext } from "react";

export const ApiContext = createContext<ApiContextType | null>(null);

export type ApiContextType = {
	config: AxiosRequestConfig;
	setToken: (token: string | null) => void;
	token: string | null;
};
