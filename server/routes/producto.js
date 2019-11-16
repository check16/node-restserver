const express = require('express');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');

let app = express();
let Producto = require('../models/producto');

app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        .skip(desde)
        .limit(limite)
        .sort('nombre')
        .populate('usuario categoria')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    total: conteo
                });
            });
        })
});

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regexp = new RegExp(termino, 'i');

    Producto.find({ nombre: regexp })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productos || productos.length == 0) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existen productos con ese término de búsqueda'
                    }
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        })
});

app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.descripcion,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});

app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion', 'nombre', 'precioUni', 'categoria']);

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el ID'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.delete('/productos/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;
    Producto.findByIdAndDelete(id, (err, productoEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoEliminado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No existe el ID'
                }
            });
        }
        res.json({
            ok: true,
            categoria: productoEliminado
        });
    })
});
module.exports = app;