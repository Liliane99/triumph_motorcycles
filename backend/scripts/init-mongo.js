db = db.getSiblingDB("admin");

db.createUser({
  user: "admin",
  pwd: "admin_password",
  roles: [{ role: "root", db: "admin" }]
});

print("Admin user created successfully");

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);

db.createUser({
  user: process.env.MONGO_INITDB_USER,
  pwd: process.env.MONGO_INITDB_PASSWORD ,
  roles: [{ role: "readWrite", db: process.env.MONGO_INITDB_DATABASE }]
});

print("Triumph user created successfully");

db.createCollection("events");

db.events.insertOne({
  type: "SYSTEM_INIT",
  data: {
    message: "MongoDB initialized successfully!"
  },
  createdAt: new Date()
});

print(" Event store initialized successfully");
