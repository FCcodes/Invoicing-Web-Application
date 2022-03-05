const fsPromises = require("fs").promises;
const sgMail = require("@sendgrid/mail");

const invoiceDB = {
	invoices: require("../../../model/invoices.json"),
	setInvoice: function (data) {
		return (this.invoices = data);
	},
};

export default async function handler(req, res) {	
	const  payload  = req.body;
	const { id } = req.query;	
	
	if (!payload) return res.status(400).json({ message: "Missing required data for body" });

	//check if request method is "POST" or no
	if (req.method !== "POST") {
		return res.status(405).json({ message: "request method is not supported at this endpoint" });
	
	}

	console.log(payload)

	//_____CONNECT TO SEND GRID_____//
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);
	const msg = {
		to: payload.billedTo.clientsEmail,
		from: "bluelightcode101@gmail.com",
		template_id:  "d-d5c2b269950145c8915f81e93893e03d",
		subject: "Invoice",
		"dynamic_template_data": payload,	
	};

	//------SEND INVOICE------//
	sgMail
		.send(msg)
		.then(() => {			
			if (id) {				
				//Update

				//Get all invoices except the invoice where its id is equal to the given ID
				let otherInvoices = invoiceDB.invoices.filter((invoice) => invoice.id !== id);

				//updating mock InvoiceDB
				try {
					invoiceDB.setInvoice([...otherInvoices, payload]);
					fsPromises.writeFile("C:/Users/Fahim/Documents/Web projects/invoice-app/model/invoices.json", JSON.stringify(invoiceDB.invoices));
				} catch (error) {
					console.log(error);
					res.status(500).json({ "message": "Seems something went wrong on the server" });
				}

				let targetInvoice = invoiceDB.invoices.find((invoice) => invoice.id === id);
				res.status(200).json({
					"message": "Invoice successfully sent to client.",
					"invoice": targetInvoice
				});

			} else {
				
				let invoices = invoiceDB.invoices;

				//Add new invoice to invoiceDB
				try {
					invoiceDB.setInvoice([... invoices, payload]);
					fsPromises.writeFile("C:/Users/Fahim/Documents/Web projects/invoice-app/model/invoices.json", JSON.stringify(invoiceDB.invoices));
				} catch (error) {
					console.log(error.message);
					res.status(500).json({ "message": "seems we are having trouble on the server" });
				}

				//respond to client
				return res.status(201).json({
					"message": "Invoice was sent successfully",
					"invoices": invoiceDB.invoices
				}); //created
			}
		})
		.catch((error) => {			
			console.error(error.message);
			return res.status(500).json({ "message": "seems we are having trouble on the server" });
		});
}
