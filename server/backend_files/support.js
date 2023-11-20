const config = require("../config.js");
const sql = require("mssql");
const { v4: uuidv4 } = require("uuid");


async function getEmployeeId(username) {
	try {
		let pool = await sql.connect(config);
		let record = await pool.request().query(`SELECT emp_id
                FROM employees_new 
                WHERE username='${username}';`);
		pool.close();
		console.log("employee");
		console.log(record.recordset[0]["emp_id"]);
		console.log(record.recordsets);
		console.log(record.recordset[0].emp_id);
		console.log(record.recordset[0].emp_id);
		return record.recordset[0].emp_id;
	} catch (error) {
		console.log(error);
	}
}

async function insertSupportTicket(customer_id, emp_id, tracking_number, username) {
    try {
        let employee_id = await getEmployeeId(username);
        console.log(`credentials exist ${employee_id}`);
        let pool = await sql.connect(config);

        // Get the current date and time
        let date_time = new Date().toISOString();

        // Generate a unique GUID for the support ticket ID
        let support_ticket_id = uuidv4();

        // Add a new record to the support table
        let query = `INSERT INTO support_ticket (support_ticket_id, customer_id, emp_id, date_time, tracking_number, status) 
        VALUES ('${support_ticket_id}', ${customer_id}, ${emp_id}, '${date_time}', ${tracking_number}});`;
        await pool.request().query(query);
        pool.close();
        return { success: "add ticket was successful" };

    } catch (error) {
        console.log(error);
    }
}

async function getSupportTickets() {
    try {
        // Get all support tickets
        let pool = await sql.connect(config);
        let query = `SELECT * FROM support_ticket;`;
        let result = await pool.request().query(query);
        pool.close();
        return result.recordsets;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    insertSupportTicket,
    getSupportTickets,
};
