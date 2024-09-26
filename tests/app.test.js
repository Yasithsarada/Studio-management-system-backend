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




describe("non-existent route", () => {
  it("should return a 404 for a non-existent route", async () => {
    const response = await request(app).get("/nonexistent");
    expect(response.statusCode).toBe(404);
  });
});

describe("Error Handling Middleware", () => {
  it("should return a 500 error for an internal server error", async () => {
    const response = await request(app).get("/error");
    expect(response.statusCode).toBe(500);
  });
  it("should return a 500 error for an internal async server error", async () => {
    const response = await request(app).get("/async-error");
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      message: "Internal Async Server Error",
      stack: expect.any(String), 
    });
  }, 10000);
});

module.exports = app;
