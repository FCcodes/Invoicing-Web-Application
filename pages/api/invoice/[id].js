const fsPromises = require("fs").promises
const path = require("path")

const invoiceDB = {
	invoices: require("../../../model/invoices.json"),
	setInvoice: function (data) {
		this.invoices = data;
	},
};

export default async function handler(req, res){
    const { id, u } = req.query        

    if(req.method !== "GET"){
        return res.status(405).json({"message": "request method is not supported at this endpoint"})
    }

    //retrieving specific invoice from DB
    const targetInvoice = invoiceDB.invoices.find(invoice => invoice.id === id && invoice.authorID === u)     
    if(!targetInvoice) return res.status(404).end()
    res.status(201).json(targetInvoice)
    res.end()
    
}