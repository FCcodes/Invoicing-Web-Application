export default function createInvoiceNumber(length) {
	let result = "";
	let characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
	let charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.ceil(Math.random() * charactersLength));
	}
	
	return result;
}

