const admin = require("firebase-admin");
require("dotenv").config();
import { User, DatabaseOperationResult, DatabaseOperationResultWithData } from "./interfaces";

const { GOOGLE_APPLICATION_CREDENTIALS } = process.env;

admin.initializeApp({
  credential: admin.credential.cert(GOOGLE_APPLICATION_CREDENTIALS),
});

const db = admin.firestore();

const getDocRef = (user: User) => {
  const { firstName, lastName } = user;
  const docRef = db.collection("users").doc((firstName[0] + lastName).toLowerCase());
  return docRef;
};

export const createUser = async (user: User): Promise<DatabaseOperationResult> => {
  const docRef = getDocRef(user);
  const userData = await docRef.get();
  if (userData.exists) {
    return {
      status: 409,
      message: "This user already exists",
    };
  }
  await docRef.set(user);
  return {
    status: 201,
    message: "User created successfully",
  };
};

export const readUser = async (user: User): Promise<DatabaseOperationResultWithData> => {
  const docRef = getDocRef(user);
  const userData = await docRef.get();
  if (!userData.exists) {
    return {
      status: 404,
      message: "User not found",
      userData,
    };
  }
  return {
    status: 200,
    message: "Request fulfilled",
    userData,
  };
};

export const updateUser = async (user: User): Promise<DatabaseOperationResult> => {
  const docRef = getDocRef(user);
  const userData = await docRef.get();
  if (!userData.exists) {
    return {
      status: 404,
      message: "User not found",
    };
  }
  await docRef.update(user);
  return {
    status: 200,
    message: "User updated successfully",
  };
};

export const deleteUser = async (user: User): Promise<DatabaseOperationResult> => {
  const docRef = getDocRef(user);
  const userData = await docRef.get();
  if (!userData.exists) {
    return {
      status: 404,
      message: "User not found",
    };
  }
  await docRef.delete();
  return {
    status: 200,
    message: "User deleted successfully",
  };
};
