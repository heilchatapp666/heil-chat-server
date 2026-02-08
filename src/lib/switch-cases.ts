export function switchStatusCodeError(code: number): string {
	switch (code) {
		case 400:
			return "Bad Request";
		case 401:
			return "Not Authorized";
		case 402:
			return "Payment Required";
		case 403:
			return "Forbidden Route";
		case 404:
			return "Not Found Route";
		case 405:
			return "Cannot request";
		case 408:
			return "Request Time out";
		default:
			return "Something went wrong";
	}
}
