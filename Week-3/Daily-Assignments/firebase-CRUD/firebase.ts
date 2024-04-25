const admin = require("firebase-admin");
require("dotenv").config();
import {
  User,
  DatabaseOperationResult,
  DatabaseOperationResultWithData,
  ArgumentsApiResponseMessage,
} from "./interfaces";

const credentials = require("./config/firebaseConfig");

admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

const db = admin.firestore();

const getDocRef = (user: User) => {
  const { firstName, lastName } = user;
  const docRef = db.collection("users").doc((firstName[0] + lastName).toLowerCase());
  return docRef;
};

const apiResponseMessage = async ({
  userData,
  writeData,
}: ArgumentsApiResponseMessage): Promise<DatabaseOperationResult> => {
  if (!userData.exists) {
    return {
      status: 404,
      message: "User not found",
    };
  }
  try {
    if (writeData) {
      await writeData.operation(writeData.user);
    }
    return {
      status: 200,
      message: "Request Fulfilled",
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

export const createUser = async (user: User): Promise<DatabaseOperationResult> => {
  const docRef = getDocRef(user);
  const userData = await docRef.get();
  if (userData.exists) {
    return {
      status: 409,
      message: "User already exists",
    };
  }
  try {
    await docRef.set(user);
    return {
      status: 200,
      message: "Request Fulfilled",
    };
  } catch (err) {
    console.log(err);
    return {
      status: 500,
      message: "Internal Server Error",
    };
  }
};

export const readUser = async (user: User): Promise<DatabaseOperationResultWithData> => {
  const docRef = getDocRef(user);
  const userData = await docRef.get();
  const reponseMessage = await apiResponseMessage({ userData });
  return { ...reponseMessage, userData };
};

export const updateUser = async (user: User): Promise<DatabaseOperationResult> => {
  const docRef = getDocRef(user);
  const userData = await docRef.get();
  const writeData = {
    operation: async (user: User) => {
      await docRef.update(user);
    },
    user,
  };
  const reponseMessage = await apiResponseMessage({ userData, writeData });
  return reponseMessage;
};

export const deleteUser = async (user: User): Promise<DatabaseOperationResult> => {
  const docRef = getDocRef(user);
  const userData = await docRef.get();
  const writeData = {
    operation: async (user: User) => {
      await docRef.delete(user);
    },
    user,
  };
  const reponseMessage = await apiResponseMessage({ userData, writeData });
  return reponseMessage;
};

module.exports = {
  readUser,
  createUser,
  updateUser,
  deleteUser,
};
