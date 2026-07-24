const dns = require("dns");

dns.resolveSrv(
    "_mongodb._tcp.leadcraftcluster.irh5f8q.mongodb.net",
    (err, records) => {
        console.log("Error:", err);
        console.log("Records:", records);
    }
);