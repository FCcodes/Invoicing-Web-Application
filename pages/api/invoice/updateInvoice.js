const fsPromises = require("fs").promises;
const path = require("path");
//const deepClone = require("lodash.clonedeep");

const invoiceDB = {
	invoices: require("../model/invoices.json"),
	setInvoice: function (data) {
		return this.invoices = data;
	},
};

export default async function handler(req, res) {
	if (req.method !== "PUT") return res.status(405).json({"message": "That request method is not supported at this endpoint"});

	const { id, u } = req.query;
	const updatedInvoice = req.body
	
	if(!updatedInvoice) return res.status(405).json({"message": "request body is required"})
	

	if (!id || !u) return res.status(400).json({ message: "Missing query string parameter" });

	let otherInvoices = invoiceDB.invoices.filter((invoice) => invoice.id !== id );
	//console.log(otherInvoices)
	// = deepClone();

	//updating mock database
	try {
		invoiceDB.setInvoice([...otherInvoices, updatedInvoice]);
		await fsPromises.writeFile("../model/invoices.json", JSON.stringify(invoiceDB.invoices));
		let targetInvoice = invoiceDB.invoices.find(invoice => invoice.id === id)		
        res.status(200).json(targetInvoice)
		
        
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Seems something went wrong on the server" })
	}

	return
}
