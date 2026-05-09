/**
 * Validation middleware for user registration
 */
export const validateRegister = (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    return next(new Error("Please provide all required fields: name, email, password, role"));
  }

  // Email regex validation
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    return next(new Error("Please provide a valid email"));
  }

  if (password.length < 6) {
    res.status(400);
    return next(new Error("Password must be at least 6 characters"));
  }

  if (!['employee', 'recruiter'].includes(role)) {
    res.status(400);
    return next(new Error("Role must be either 'employee' or 'recruiter'"));
  }

  next();
};

/**
 * Validation middleware for user login
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    return next(new Error("Please provide email and password"));
  }

  next();
};

/**
 * Validation middleware for creating a recruiter profile
 */
export const validateRecruiterProfile = (req, res, next) => {
  const { companyName, recruiterName } = req.body;

  if (!companyName || !recruiterName) {
    res.status(400);
    return next(new Error("Please provide companyName and recruiterName"));
  }

  next();
};

/**
 * Validation middleware for creating a job
 */
export const validateJob = (req, res, next) => {
  const { title, description, requiredSkills, jobType } = req.body;

  if (!title || !description || !requiredSkills || !jobType) {
    res.status(400);
    return next(new Error("Please provide title, description, requiredSkills, and jobType"));
  }

  if (!Array.isArray(requiredSkills) || requiredSkills.length === 0) {
    res.status(400);
    return next(new Error("requiredSkills must be a non-empty array"));
  }

  next();
};

