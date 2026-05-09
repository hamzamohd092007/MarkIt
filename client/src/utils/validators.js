export const normalizeName = (str = "") =>
  str
    .replace(/[^a-zA-Z\s'-]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

export const formatName = (str = "") =>
  normalizeName(str)
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());

export const normalizeEmail = (str = "") => str.trim().toLowerCase();

const isValidEmail = (email = "") => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email);

export const getPasswordStrength = (password) => {
  if (!password) return "";
  let strength = 0;
  if (password.length >= 6) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  if (strength <= 1) return "Weak";
  if (strength === 2) return "Medium";
  return "Strong";
};

export const validateAuth = ({ type, fullName, email, password, confirmPassword }) => {
  const name = formatName(fullName);
  const normalizedEmail = normalizeEmail(email);
  let errors = {};
  if (!normalizedEmail) {
    errors.email = "Email is required";
  } else if (!isValidEmail(normalizedEmail)) {
    errors.email = "Invalid email";
  }
  if (!password) {
    errors.password = "Password is required";
  }
  if (type === "signup") {
    if (!name) {
      errors.fullName = "Full name is required";
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Confirm your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";

    }
  }
  return {
    isValid: Object.keys(errors).length === 0,
    isSubmitValid: Object.keys(errors).length === 0,
    errors,
    formatted: {
      fullName: name,
      email: normalizedEmail,
    },
  };
};

export const validateProfileUpdate = ({ fullName, email, avatar, oldPassword, newPassword, confirmPassword, user, }) => {
  const name = formatName(fullName);
  const normalizedEmail = normalizeEmail(email);
  const isNameChanged = name && name !== user?.fullName;
  const isEmailChanged = normalizedEmail && normalizedEmail !== user?.email;
  const isAvatarChanged = avatar !== user?.avatar;
  const isPasswordEntered = newPassword || confirmPassword;
  const isPasswordValid = !isPasswordEntered || (newPassword && confirmPassword && newPassword === confirmPassword);
  let isEmailInvalid = false;
  if (isEmailChanged && !isValidEmail(normalizedEmail)) {
    isEmailInvalid = true;
  }
  const isAnyChange = isNameChanged || isEmailChanged || isAvatarChanged || isPasswordEntered;
  const isValid = isAnyChange && !isEmailInvalid && isPasswordValid;
  return {
    isValid,
    formatted: {
      fullName: name,
      email: normalizedEmail,
    },
    isEmailInvalid
  };
};

export const validateTag = (str) => {
  if (!str) return "";
  return str
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map(word => {
      if (word === word.toUpperCase()) return word;
      if (word.length === 1) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

export const validateTitle = (str) => {
  if (!str) return "";
  return str
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .map(word => {
      if (word === word.toUpperCase()) return word;
      if (word.length === 1) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export const validateURL = (str) => {
  if (!str) return "";
  let url = str.trim();
  url = url.replace(/\s+/g, "");
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

export const validateDescription = (str) => {
  if (!str) return "";
  return str
    .replace(/\s+/g, " ")
    .trim();
}