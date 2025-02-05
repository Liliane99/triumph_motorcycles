db = db.getSiblingDB("admin");

db.createUser({
  user: "admin",
  pwd: "admin_password",
  roles: [{ role: "root", db: "admin" }]
});

print("Admin user created successfully");

db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE || "triumphmotor_eventstore");

db.createUser({
  user: process.env.MONGO_INITDB_USER || "triumph_user",
  pwd: process.env.MONGO_INITDB_PASSWORD || "triumph_password",
  roles: [{ role: "readWrite", db: process.env.MONGO_INITDB_DATABASE || "triumphmotor_eventstore" }]
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