const database = [];

export async function saveUserData(data) {
  database.push(data);
}

export async function getUserData() {
  return database;
}