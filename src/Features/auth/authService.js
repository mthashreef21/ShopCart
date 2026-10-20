const USERS_KEY = "shopcart_users";
const SESSION_KEY = "shopcart_session";

// Get registered users
const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

// Get currently logged-in user
export const getCurrentUser = () => {
  try {
    const session =
      sessionStorage.getItem(SESSION_KEY) ||
      localStorage.getItem(SESSION_KEY);

    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

// Notify Navbar and other components about authentication changes
const notifyAuthChange = () => {
  window.dispatchEvent(new Event("auth-change"));
};

// Register a new user
export const registerUser = ({ name, email, password }) => {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.email === normalizedEmail
  );

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const newUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
  };
};

// Log in an existing user
export const loginUser = (email, password, remember = true) => {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (item) =>
      item.email === normalizedEmail &&
      item.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  const session = JSON.stringify(sessionUser);

  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);

  if (remember) {
    localStorage.setItem(SESSION_KEY, session);
  } else {
    sessionStorage.setItem(SESSION_KEY, session);
  }

  notifyAuthChange();

  return sessionUser;
};

// Update current user's profile
export const updateUserProfile = ({ name, email }) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("Please log in to update your profile.");
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedName.length < 3) {
    throw new Error("Name must be at least 3 characters.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
    throw new Error("Please enter a valid email address.");
  }

  const users = getUsers();

  const userIndex = users.findIndex(
    (user) => user.id === currentUser.id
  );

  if (userIndex === -1) {
    throw new Error("Account not found. Please register again.");
  }

  const emailExists = users.some(
    (user, index) =>
      index !== userIndex &&
      user.email.toLowerCase() === normalizedEmail
  );

  if (emailExists) {
    throw new Error("This email is already registered.");
  }

  users[userIndex] = {
    ...users[userIndex],
    name: normalizedName,
    email: normalizedEmail,
  };

  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  const updatedUser = {
    id: currentUser.id,
    name: normalizedName,
    email: normalizedEmail,
  };

  const session = JSON.stringify(updatedUser);

  if (localStorage.getItem(SESSION_KEY)) {
    localStorage.setItem(SESSION_KEY, session);
  } else {
    sessionStorage.setItem(SESSION_KEY, session);
  }

  notifyAuthChange();

  return updatedUser;
};

// Log out
export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);

  notifyAuthChange();
};