import { createUser, deleteUser, updateUser } from "../firebase";

const { readUser } = require("../firebase");

describe("Checking all crud operations of firebase", () => {
  it("should be return 404 when accessing non-existing user", async () => {
    const user = {
      firstName: "test",
      lastName: "testing",
    };
    const result = await readUser(user);
    expect(result.status).toEqual(404);
  });
  it("should be return 404 when updating non-existing user", async () => {
    const user = {
      firstName: "test",
      lastName: "testing",
      age: 21,
    };
    const result = await updateUser(user);
    expect(result.status).toEqual(404);
  });
  it("should be return 404 when deleting non-existing user", async () => {
    const user = {
      firstName: "test",
      lastName: "testing",
    };
    const result = await deleteUser(user);
    expect(result.status).toEqual(404);
  });
  it("should be return 201 when creating non-existing user", async () => {
    const user = {
      firstName: "test",
      lastName: "testing",
    };
    const result = await createUser(user);
    expect(result.status).toEqual(201);
  });
  it("should be return 409 when creating existing user", async () => {
    const user = {
      firstName: "test",
      lastName: "testing",
    };
    const result = await createUser(user);
    expect(result.status).toEqual(409);
  });
  it("should be return 200 when accessing existing user", async () => {
    const user = {
      firstName: "test",
      lastName: "testing",
    };
    const result = await readUser(user);
    expect(result.status).toEqual(200);
  });
  it("should be return 200 when updating existing user", async () => {
    const user = {
      firstName: "test",
      lastName: "testing",
      age: 21,
    };
    const result = await updateUser(user);
    expect(result.status).toEqual(200);
  });
  it("should be return 200 when deleting existing user", async () => {
    const user = {
      firstName: "test",
      lastName: "testing",
    };
    const result = await deleteUser(user);
    expect(result.status).toEqual(200);
  });
});
