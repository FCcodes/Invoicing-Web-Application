const fsPromises = require("fs").promises
const path = require("path").promises

let invoiceDB = {
    invoices: require("../model/invoices.json")	
}

export default async function handler(req, res){    

    const { u } = req.query
    

    //checking if request method is not Get
    if(req.method !== "GET"){
        return res.status(405).json({"message": "request method is not supported at this endpoint"})
    }

    if(!u){
        return req.status(400).json({"message": "missing query string parameter \"u\" "})
    }

    //returning all invoices
    let invoices = invoiceDB.invoices.filter(invoice => invoice.authorID === u)    
    
    //send invoices to client
    res.status(200).json(invoices)
    res.end()
    return

}