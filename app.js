const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'tu_clave_secreta'; // Cambia esto por una clave más segura

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio público
app.use(express.static('public'));

// Ruta para la raíz
app.get('/', (req, res) => {
    res.send('¡Bienvenido a la aplicación!'); // Mensaje de bienvenida
});

// Ruta de inicio de sesión
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

// Aquí puedes agregar tus rutas protegidas
app.get('/ruta-protegida', authenticateToken, (req, res) => {
    res.send('Esta es una ruta protegida');
});

// Middleware para verificar el JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
