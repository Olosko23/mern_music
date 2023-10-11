import chai from "chai";
import chaiHttp from "chai-http";
import app from "../index.js";

const { expect } = chai;

chai.use(chaiHttp);

describe("Login Route", () => {
  it("should return a JWT token when providing valid credentials", (done) => {
    const userCredentials = {
      username: "olosko",
      password: "olosko",
    };

    chai
      .request(app)
      .post("/api/v1/auth/login")
      .send(userCredentials)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("token");
        done();
      });
  });
});
