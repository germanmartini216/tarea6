const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'tu_clave_secreta'; // Cambia esto por una clave más segura

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // Aquí deberías buscar al usuario en tu base de datos
    const user = await findUserByUsername(username); // Implementa esta función

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    return res.status(401).send('Credenciales inválidas');
});
