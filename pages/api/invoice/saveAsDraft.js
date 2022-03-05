const fsPromises = require("fs").promises;
const path = require("path");
const {v4 : uuid4} = require("uuid")

const invoiceDB = {
	invoices: require("../../../model/invoices.json"),
	setInvoice: function (data) {
		this.invoices = data;
	},
};

export default async function handler(req, res) {
	const invoice = req.body;
	console.log(invoice)
	let refactorInvoice = {
		...invoice,
		id: uuid4()
	}
	console.log(refactorInvoice)

	if(!invoice) return res.status(400).json({"message": "request body is required"})

    //check if request method is "POST" or no
    if(req.method !== "POST"){
        return res.status(405).json({"message": "request method is not supported at this endpoint"})
    }

	//add new invoice to DB
    let otherInvoices = invoiceDB.invoices
	try {
		invoiceDB.setInvoice([...otherInvoices, refactorInvoice]);
		fsPromises.writeFile("C:/Users/Fahim/Documents/Web projects/invoice-app/model/invoices.json", JSON.stringify(invoiceDB.invoices));
	} catch (error) {
        console.log(error)
        res.status(500).end()
    }

    //respond to client
	res.status(201).json(invoiceDB.invoices); //created
	res.end();
    return
}
