const sql=require("mssql")//imports the mssql package, which is used for interacting with Microsoft SQL Server databases.

//process.env is used to access these environment variables.
// const server = process.env.AZURE_SQL_SERVER
const server = "studio-server1.database.windows.net"
// const database =process.env.AZURE_SQL_DATABASE
const database ="smsDB"
const port =1433 //port is set to 1433, the default port for SQL Server.
const type = process.env.AZURE_SQL_AUTHENTICATIONTYPE;
const user = process.env.AZURE_SQL_USERNAME
const password =process.env.AZURE_SQL_PASSWORD

const config = {
    server,
    port,
    database,
    user,
    password,
    pool: {
        idleTimeoutMillis: 60000
      },
    requestTimeout : 60000,
    options: {
        encrypt: true,
        trustServerCertificate:false
    }
}

async function connection(){
    try {
        await sql.connect(config)
        console.log("connected to database");
    } catch (error) {
        console.log("error",error);
    }
    finally{
        await sql.close();
    }
}

module.exports={
    connection
}

