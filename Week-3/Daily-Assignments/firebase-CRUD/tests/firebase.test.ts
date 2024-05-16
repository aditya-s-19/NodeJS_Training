import { createUser, deleteUser, updateUser } from "../firebase";
import { User } from "../interfaces";

const { readUser } = require("../firebase");

describe("Checking all crud operations of firebase", () => {
  const user: User = {
    firstName: "test",
    lastName: "testing",
  };
  it("should be return 404 when accessing non-existing user", async () => {
    const result = await readUser(user);
    expect(result.status).toEqual(404);
  });
  it("should be return 404 when updating non-existing user", async () => {
    const updatedUser: User = {
      ...user,
      dateOfBirth: "12-12-2001",
    };
    const result = await updateUser(updatedUser);
    expect(result.status).toEqual(404);
  });
  it("should be return 404 when deleting non-existing user", async () => {
    const result = await deleteUser(user);
    expect(result.status).toEqual(404);
  });
  it("should be return 201 when creating non-existing user", async () => {
    const result = await createUser(user);
    expect(result.status).toEqual(201);
  });
  it("should be return 409 when creating existing user", async () => {
    const result = await createUser(user);
    expect(result.status).toEqual(409);
  });
  it("should be return 200 when accessing existing user", async () => {
    const result = await readUser(user);
    expect(result.status).toEqual(200);
  });
  it("should be return 200 when updating existing user", async () => {
    const updatedUser: User = {
      ...user,
      dateOfBirth: "12-12-2001",
    };
    const result = await updateUser(updatedUser);
    expect(result.status).toEqual(200);
  });
  it("should be return 200 when deleting existing user", async () => {
    const result = await deleteUser(user);
    expect(result.status).toEqual(200);
  });
});
