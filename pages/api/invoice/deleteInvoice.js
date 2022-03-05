const fsPromises = require("fs").promises;
const path = require("path");
//const deepClone = require("lodash.clonedeep");

const invoiceDB = {
	invoices: require("../../../model/invoices.json"),
	setInvoice: function (data) {
		return this.invoices = data;
	},
};

export default async function handler(req, res) {
	if (req.method !== "DELETE") return res.status(405).json({"message": "request method is not supported at this endpoint"});

    

	const { id, u } = req.query;
	if (!id || !u) return res.status(400).json({ message: "missing query string parameter" });

	let newInvoices = invoiceDB.invoices.filter((invoice) => invoice.id !== id);
	//newInvoices = deepClone(newInvoices);

	//updating mock database
	try {
		invoiceDB.setInvoice([...newInvoices]);
		await fsPromises.writeFile("../model/invoices.json", JSON.stringify(newInvoices));
        res.status(204).redirect('/')
        
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Seems something went wrong on the server" })
	}

	return
}
