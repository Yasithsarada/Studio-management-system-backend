const request = require("supertest");
const express = require("express");
const app = express();
require('dotenv').config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const db = require("../config/db.config.js");

beforeAll(async () => {
  await db.sequelize.sync()
},15000);
const { notFound, errorHandler } = require("../middleware/errorHandler.js");
const expressAsyncHandler = require("express-async-handler");


app.get("/test", (req, res) => res.send("Hello I am a dummy test router!"));

// Route to simulate an internal server error
app.get("/error", (req, res, next) => {
  next(new Error("Internal Async Server Error"));
});


app.get(
  "/async-error",
  expressAsyncHandler(async (req, res, next) => {
    throw new Error("Internal Async Server Error");
  })
);
const customerManagerRouter=require("../router/stdioSide/customerManager");

app.use("/customerManager",customerManagerRouter)

console.log("nothin tested");
// Error handling middlewares
app.use(notFound);
app.use(errorHandler);


describe("Customer Management Routes", () => {

  // Test for creating a customer
  describe("POST /customer", () => {
    it("should create a new customer", async () => {
      const response = await request(app)
        .post("/customerManager/customer")
        .send({
          firstname: "John",
          lastname: "Doe",
          email: "john322ww1@example.com",
          address: "123 Main St",
          mobilePhone: "123456789555990",
          status: 0
        });
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");
    });

    it("should return 400 if customer already exists", async () => {
      

      const response = await request(app)
        .post("/customerManager/customer")
        .send({
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@example.com",
          address: "123 Main St",
          mobilePhone: "1234567890",
          status: 0
        });

      expect(response.statusCode).toBe(409);
      expect(response.body).toEqual({ message: "Customer already exist" });
    });

    it("should return 400 if mobilePhone is missing", async () => {
      const response = await request(app)
        .post("/customerManager/customer")
        .send({
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@example.com",
          address: "123 Main St",
          status: 0
        });
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual({ message: "Customer required mobilephone or email" });
    });
  });
})