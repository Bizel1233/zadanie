import { useCallback, useEffect, useState } from "react";
import { clientAppsDataType } from "./useMain";
import { useSearchParams } from "react-router-dom";

export const usePage = (data: clientAppsDataType | undefined, itemsPerPage: number) => {
	const [currentPage, setCurrentPage] = useState<number | null>(null);
	const [searchParams, setSearchParams] = useSearchParams();

	// ustawienie aktualnej strony do parametru w URL
	useEffect(() => {
		if (currentPage === null) {
			if (data != undefined) {
				const page = Number(searchParams.get("page")) > 0 ? Number(searchParams.get("page")) : 1;
				setPage(page);
			}
		} else {
			setParams("page", currentPage?.toString() ?? "1");
		}
	}, [currentPage, data]);

	// ustawienie aktualnej strony na ostatnią, jeśli aktualna strona jest większa niż ostatnia
	useEffect(() => {
		const lastPage = Number(data?.["hydra:view"]?.["hydra:last"]?.split("=")?.[2] ?? 1);
		if (currentPage && currentPage > lastPage) {
			setCurrentPage(lastPage);
			return;
		}
	}, [data]);

	// ustawienie nowej strony
	const setPage = useCallback(
		(newPage: number) => {
			if (!newPage) return;

			// jeśli nowa strona jest większa niż ostatnia to ustaw ostatnią
			const lastPage = Number(data?.["hydra:view"]?.["hydra:last"]?.split("=")?.[2] ?? 1);
			if (newPage > lastPage) {
				setCurrentPage(lastPage);
				return;
			}

			// jeśli nowa strona jest mniejsza niż pierwsza(1) to ustaw 1
			if (newPage < 1) {
				setCurrentPage(1);
				return;
			}

			setCurrentPage(newPage);
		},
		[data, currentPage, itemsPerPage]
	);

	// ustawienie parametru w URL
	const setParams = (param: string, value: string) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.set(param, value);
		setSearchParams(newParams);
	};

	return { currentPage, setPage, setParams };
};
