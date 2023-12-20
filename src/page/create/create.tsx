import { useEffect, useRef, useState } from "react";
import "./create.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../common/useAuth";
import { CreateClientAppBodyType, useCreate } from "../../common/useCreate";

export default function Create() {
	const { createClientApp } = useCreate();
	const navigate = useNavigate();
	const { logout } = useAuth();

	const appName = useRef<HTMLInputElement | null>(null);
	const version = useRef<HTMLInputElement | null>(null);
	const url = useRef<HTMLInputElement | null>(null);
	const fileName = useRef<HTMLInputElement | null>(null);
	const md5 = useRef<HTMLInputElement | null>(null);
	const launchArgs = useRef<HTMLInputElement | null>(null);

	const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
	const container = useRef<HTMLDivElement>(null);

	// dodawanie komunikatu o błędzie do konkretnego pola
	const addErrorMessage = (inputRef: HTMLInputElement, message: string) => {
		inputRef.classList.add("input_error");
		const div = inputRef.nextSibling as HTMLDivElement;
		div.textContent = message;
	};

	// Walidacja danych
	const checkData = async () => {
		let isError: boolean = false;
		// Jeżeli pola, które są wymagane są puste, dopisz komunikat o błędzie
		if (appName.current?.value === "") {
			addErrorMessage(appName.current, "Pole nie może być puste");
			isError = true;
		}
		if (version.current?.value === "") {
			addErrorMessage(version.current, "Pole nie może być puste");
			isError = true;
		}
		if (url.current?.value === "") {
			addErrorMessage(url.current, "Pole nie może być puste");
			isError = true;
		}
		if (fileName.current?.value === "") {
			addErrorMessage(fileName.current, "Pole nie może być puste");
			isError = true;
		}
		if (md5.current?.value === "") {
			addErrorMessage(md5.current, "Pole nie może być puste");
			isError = true;
		}

		if (isError) return;

		const data: CreateClientAppBodyType = {
			version: version.current!.value,
			url: url.current!.value,
			fileName: fileName.current!.value,
			md5: md5.current!.value,
			appName: appName.current!.value,
			description: descriptionTextareaRef.current!.value === "" ? null : descriptionTextareaRef.current!.value,
			launchArgs: launchArgs.current!.value === "" ? null : launchArgs.current!.value,
		};
		try {
			const res = await createClientApp(data);
			if (res !== undefined) navigate(`/clientApp/${res.data.id}`);
		} catch (e) {
			console.log(e);
		}
	};

	const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		// Jeżeli zmieniono wartość, usuń komunikat o błędzie, jeżeli istnieje
		if (event.currentTarget.classList.contains("input_error")) {
			event.currentTarget.classList.remove("input_error");
			const errorDiv = event.currentTarget.nextSibling as HTMLDivElement;
			errorDiv.textContent = "";
		}

		// Jeżeli wciśnięto enter, sprawdź dane
		if (event.key === "Enter") checkData();
	};

	// W razie dłużego opisu zmian, textarea się powiększa
	const useAutosizeTextArea = () => {
		if (descriptionTextareaRef) {
			descriptionTextareaRef.current!.style.height = "0px";
			const scrollHeight = descriptionTextareaRef.current!.scrollHeight;
			container.current!.style.height = scrollHeight + 740 + "px";
			descriptionTextareaRef.current!.style.height = scrollHeight - 10 + "px";
		}
	};

	return (
		<div>
			<div className="create_container" ref={container}>
				<button className="logout_button create_logout_button" onClick={logout}>
					Wyloguj się
				</button>
				<div className="go_back_button">
					<Link to="/main">
						<button>Cofnij</button>
					</Link>
				</div>
				<div>
					<div className="input_description">Nazwa aplikacji</div>
					<input className="huge_input" type="text" ref={appName} onKeyDown={handleEnterPress}></input>
					<div className="error_message"></div>
				</div>
				<div>
					<div className="input_description">Wersja aplikacji</div>
					<input className="huge_input" type="text" ref={version} onKeyDown={handleEnterPress}></input>
					<div className="error_message"></div>
				</div>
				<div>
					<div className="input_description">Adres URL do paczki aplikacji</div>
					<input className="huge_input" type="text" ref={url} onKeyDown={handleEnterPress}></input>
					<div className="error_message"></div>
				</div>
				<div>
					<div className="input_description">Nazwa docelowego pliku głównego .exe aplikacji</div>
					<input className="huge_input" type="text" ref={fileName} onKeyDown={handleEnterPress}></input>
					<div className="error_message"></div>
				</div>
				<div>
					<div className="input_description">Hash MD5 paczki aplikacji</div>
					<input className="huge_input" type="text" ref={md5} onKeyDown={handleEnterPress}></input>
					<div className="error_message"></div>
				</div>
				<div>
					<div className="input_description">Argumenty uruchomienia aplikacji</div>
					<input className="huge_input" type="text" ref={launchArgs} onKeyDown={handleEnterPress}></input>
					<div className="error_message"></div>
				</div>
				<div>
					<div className="input_description">Opis zmian w aplikacji</div>
					<textarea className="huge_input" ref={descriptionTextareaRef} onChange={useAutosizeTextArea} />
					<div className="error_message"></div>
				</div>
				<div className="button_container create_button_container">
					<button className="login_button" onClick={checkData}>
						Dodaj
					</button>
				</div>
			</div>
		</div>
	);
}
