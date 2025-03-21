const express = require("express");
const router = express.Router();
const {
    register,
    Login,
    // updateUser,
    logout,
    getAllUsers,
} = require("../controllers/user");


router.post("/register", register);
router.get("/register", (req, res) => {
    res.send("register");
});
router.post("/login", Login);
// router.put("/update/:id", updateUser);
router.post("/logout", logout);
router.get("/users", getAllUsers);


module.exports = router;