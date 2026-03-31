exports.getLogin = (req, res) => {
  res.render("login")
}

exports.postLogin = (req, res) => {
  const { email, password } = req.body

  console.log("FORM DATA:", req.body) 

  if (!email || !password) {
    return res.redirect("/login")
  }

  req.session.isLoggedIn = true
  req.session.email = email
  req.session.password = password

  res.redirect("/home")
}

exports.getHome = (req, res) => {
  res.render("home", {
    email: req.session.email,
    password: req.session.password,
    sessionId: req.sessionID
  })
}

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login")
  })
}
