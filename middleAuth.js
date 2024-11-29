app.get('/ruta-protegida', authenticateToken, (req, res) => {
    res.send('Esta es una ruta protegida');
});
