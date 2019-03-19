
const handleSignin = (db, bcrypt) => (req,res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json('Invalid credentials');
    } else {   
        db.select('email','hash').from('login')
            .where('email','=', email)
            .then(data => {
                const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
                if(isValid){
                    return db.select('*').from('users')
                        .where('email','=', email)
                        .then(user => {
                            delete user[0].email;
                            res.json(user[0]);
                        })
                        .catch((err) => res.status(400).json('Error logging in'))
                } else {
                    res.status(400).json('Wrong credentials');
                }
            })
            .catch(err => res.status(400).json('Wrong credentials'));
    }
}
module.exports = {
    handleSignin: handleSignin
};