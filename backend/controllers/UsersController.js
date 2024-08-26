import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";


export const getUsers = async (req, res) => {
	await User.find({}, { _id: 1, name: 1, username: 1, email: 1, partnerId: 1 })
	.then((result) => {
		res.json(result)
	})
	.catch((error) => {
		res.status(500).json({message: error.message});
	});
}

export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id, 
		{_id: 1, name: 1, username: 1, email: 1, partnerId: 1});
		res.json(user);
	} catch (error) {
		res.status(404).json({message: error.message});
	}
}

export const addPartner = async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      const partner = await User.findById(req.body["partner"]);

      // Check if partner is provided in the request
      if (typeof req.body["partner"] === 'undefined') {
         return res.status(401).send({ message: "Partner tidak ditemukan" });
      }

      // Prevent user from adding themselves as a partner
      if (req.params.id === req.body["partner"]) {
         return res.status(401).send({ message: "Tidak bisa menambahkan diri kamu sebagai partner" });
      }

      // Check if both users do not already have a partner
      if (user?.partnerId || partner?.partnerId) {
         return res.status(401).send({ message: "Kamu atau keduanya sudah punya partner" });
      }

      // Update both users with each other's partnerId
      await User.updateOne({ _id: req.params.id }, { $set: { partnerId: req.body["partner"] } });
      await User.updateOne({ _id: req.body["partner"] }, { $set: { partnerId: req.params.id } });

      // Send a success response after both updates
      res.status(200).json({ message: "Partner berhasil ditambahkan" });

   } catch (error) {
      // Catch and handle any errors
      res.status(500).send({ message: error.message });
   }
};

export const deletePartner = async (req, res) => {
   try {

      await User.updateOne({ _id: req.params.id }, { $set: { partnerId: "" } });
      await User.updateOne({ _id: req.body["partner"] }, { $set: { partnerId: "" } });

      // Send a success response after both updates
      res.status(200).json({ message: "Partner berhasil dihapus" });

   } catch (error) {
      // Catch and handle any errors
      res.status(500).send({ message: error.message });
   }
}

export const register = async (req, res) => {
	const isValidUsername = validator.isAlphanumeric(req.body["username"]);
	const isUsernameExist = await User.findOne({ username: req.body["username"] });
	const isEmailExist = await User.findOne({ email: req.body["email"] });
	const isPasswordMatch = req.body["password"] === req.body["confirm-password"];

	// Cek validasi yang diinput adalah email
	const isEmail = validator.isEmail(req.body["email"]);
	// Cek validasi yang diinput adalah string
	function isAlphaWithSpaces(str) {
  // Check if the string is alphabetic when spaces are removed
		const withoutSpaces = str.replace(/\s/g, '');
		return validator.isAlpha(withoutSpaces) && /^[a-zA-Z\s]+$/.test(str);
	}
	const isString = isAlphaWithSpaces(req.body["name"]);
	// cek username hanya boleh huruf kecil
	const isUsernameLowerCase = validator.isLowercase(req.body["username"]);

	const validationErrors  = {};


	// Cek apakah nama hanya huruf
	if (!isString) {
		validationErrors.nameError = "Hanya boleh huruf";
	}

	// Cek apakah username hanya huruf kecil
	if (!isUsernameLowerCase) {
		validationErrors.usernameLowerCaseError = "Hanya boleh huruf kecil";
	}
	// Cek apakah nama hanya huruf
	if (!isString) {
		validationErrors.nameError = "Hanya boleh huruf";
	}
	// Cek apakah password sudah cocok dengan confirm password
	if (!isPasswordMatch) {
		validationErrors.passwordMatchError = "Kata sandi tidak cocok";
	}
	// Cek email valid
	if (!isEmail) {
		validationErrors.emailValid = "Email tidak valid";
	}
	// Cek apakah email sudah terdaftar
	if (isEmailExist) {
		validationErrors.emailError = "Email sudah terdaftar";
	}
	// Cek apakah username sudah valid
	if (!isValidUsername) {
		validationErrors.usernameValidError = 'Hanya boleh huruf, angka, "_", dan "."';
	}
	// Cek apakah username sudah dipakai
	if (isUsernameExist) {
		validationErrors.usernameError = "Username sudah dipakai orang lain";
	}

	// ubah nama ke capitilize each word
	const toTitleCase = (phrase) => {
		return phrase
			.toLowerCase()
			.split(' ')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	};

	// Cek apakah email, username, dan password sudah terpenuhi
	if (!isEmailExist && isValidUsername && !isUsernameExist && isPasswordMatch && isEmail && isString && isUsernameLowerCase) {
		const salt = await bcrypt.genSalt();
		const hashPassword = await bcrypt.hash(req.body["password"], salt);
		await User.create({
			name: toTitleCase(req.body["name"]),
			username: req.body["username"],
			email: req.body["email"],
			password: hashPassword
		})
		.then((result) => {
			res.status(200).json({message: "Register berhasil"})
		})
		.catch((error) => {
			console.log(error);
			
		})
	} else {
		return res.status(400).json(validationErrors);
	}
}

export const login = async (req, res) => {
	const emailUsernameInput = req.body["email-username-input"]; 
	const passwordInput = req.body["password"]; 

	// Cek validasi yang diinput adalah email
	const isEmail = validator.isEmail(emailUsernameInput);

	if (isEmail) {
		// Cek apakah email sudah terdaftar
		const userWithEmail  = await User.findOne({ email: emailUsernameInput });
		if (userWithEmail ) {
			const isPasswordMatch = await bcrypt.compare(passwordInput, userWithEmail.password);
			if (isPasswordMatch) {
				const userId = userWithEmail._id;
				const name = userWithEmail.name;
				const username = userWithEmail.username;
				const email = userWithEmail.email;
				const partnerId = userWithEmail.partnerId;
				const accessToken = jwt.sign({userId, name, username, email, partnerId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "20s"});
				const refreshToken = jwt.sign({userId, name, username, email, partnerId}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1d"});

				await User.updateOne(            
					{_id: userWithEmail._id},
					{
						$set: {
							refresh_token: refreshToken
						}
					}
				);

				res.cookie("refreshToken", refreshToken, {
					httpOnly: true,
					maxAge: 24 * 60 * 60 * 1000
				});

				res.json({accessToken});
			} else {
				return res.status(400).json({ passwordError: "Kata sandi salah. Coba lagi." });
			}
		} else {
			return res.status(400).json({ messageError: "Email belum terdaftar" });
		}
	} else {
		// Cek apakah username sudah terdaftar
		const userWithUsername = await User.findOne({ username: emailUsernameInput });
		if (userWithUsername) {
			const isPasswordMatch = await bcrypt.compare(passwordInput, userWithUsername.password);
			if (isPasswordMatch) {
				const userId = userWithUsername._id;
				const name = userWithUsername.name;
				const username = userWithUsername.username;
				const email = userWithUsername.email;
				const partnerId = userWithUsername.partnerId;
				const accessToken = jwt.sign({userId, name, username, email, partnerId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "20s"});
				const refreshToken = jwt.sign({userId, name, username, email, partnerId}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "1d"});

				await User.updateOne(            
					{_id: userWithUsername._id},
					{
						$set: {
							refresh_token: refreshToken
						}
					}
				);

				res.cookie("refreshToken", refreshToken, {
					httpOnly: true,
					maxAge: 24 * 60 * 60 * 1000
				});

				res.json({accessToken});
			} else {
				return res.status(400).json({ passwordError: "Kata sandi salah. Coba lagi atau klik Lupa sandi untuk mereset." });
			}
		} else {
			return res.status(400).json({ messageError: "Username belum terdaftar" });
		}
	}
}

export const logout = async (req, res) => {
	const refreshToken = req.cookies.refreshToken;
	if (refreshToken) {
		await User.findOne({ refresh_token: refreshToken })
      .then(async (result) => {
         if (result) {
				const userId = result._id;
				await User.updateOne(            
					{_id: userId},
					{
						$set: {
							refresh_token: null
						}
					}
				);

				res.clearCookie("refreshToken");
				return res.sendStatus(200);
         } else {
            return res.sendStatus(204);
         }
      })
      .catch((error) => {
         console.log(error);
      })
	} else {
		return res.sendStatus(204);
	}
}