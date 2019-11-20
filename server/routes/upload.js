const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let extensionesValidas = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
    if (extensionesValidas.indexOf(archivo.mimetype) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'La extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        });
    }

    //Cambiar nombre archivo
    let nombreArchivo = `${id}_${new Date().getTime()}.${archivo.name.split('.').pop()}`

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
    });
    tipo === 'usuarios' ? imagenUsuario(id, res, nombreArchivo) : imagenProducto(id, res, nombreArchivo);
});

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioBD) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoBD) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivo(productoBD.img, 'productos');

        productoBD.img = nombreArchivo;
        productoBD.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;