app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
// Deserialize user from the sessions
passport.deserializeUser((user, done) => done(null, user));
// passport middleware
passport.use(
        new FacebookStrategy(
                {
                        clientID: process.env.clientID,
                        clientSecret: process.env.clientSecret,
                        callbackURL:
                        "https://invitation-system.herokuapp.com/auth/facebook/callback",
                        profileFields: ["id", "displayName", "photos", "email"],
                        enambleProof: true
                },
                function(accessToken, refreshToken, profile, done) {
                        //we get above 4 things from fb
                        //first we check if user is in db, if not we add user and give done cb
                        let pro_email = profile.emails[0].value;
                        client.query(
                                `SELECT * FROM users WHERE email='${pro_email}'`,
                                (err, doc) => {
                                        if (err) {
                                                console.log(err);
                                        }
                                        if (doc.rows.length >= 1) {
                                                console.log("ran");
                                                done(null, doc);
                                        } else {
                                                console.log("yes");
                                                let shortId = shortid.generate();
                                                while(shortId.indexOf('-')>=0){
                                                        shortId = shortid.generate();
                                                }
                                                client.query(
                                                        'INSERT INTO users (name, link, email) VALUES {'${
                                                                profile.displayName
                                                        }','${shortId}','${pro_email}')`,
                                                        (err, doc) => {
                                                                if (err) {
                                                                        console.log(err);
                                                                } else {
                                                                        done(null, {rows:[{name:profile.displayName,link:shortId,email:pro_email}]});
                                                                }
                                                        }
                                                );
                                        }
                                }
                        );
                }
        )
);
//facebook cb url
app.get(
        "/auth/facebook/callback",
        passport.authenticate("facebook, {
                successRedirect: "/home",
                failureRedirect: "/auth/facebook",
        })
);

app.get(
        "/auth/facebook",
        passport.authenticate("facebook", { scope: "email" })
);

