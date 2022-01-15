var express = require('express');
var fs = require('fs');
var path = require('path');
const { getMaxListeners } = require('./dbconnection.js');
const bodyParser = require('body-parser');
var tools = require('./dbconnection.js');
const { send } = require('process');
const res = require('express/lib/response');

var app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


let variableDePrueba = [
    {
        'Email': "matiduraan@gmail.com"
    },
    {
        'Email': "bianmazarela@gmail.com",
        'Nombre': 'Bianca',
        'Apellido': 'Mazzarella'
    },
    {
        'Email': "maildeprueba@gmail.com",
        'Nombre': 'Mail',
        'Apellido': 'DePrueba'
    },
]

app.get('/', function (req, res) {
    res.send(dividirGastos(16));
    //res.send(obtenerGastoTotalUsuario(1, 'matiduraan@gmail.com'));
    //res.send(obtenerGastoTotalMesa(1));
    /*var nuevoUsuario = {
        "CVU": 12345,
        "CBU": 123456,
        "AliasCBU": 'CBU',
        "AliasCVU": 'CVU',
        "Email": 'martin@gmail.com',
        "Telefono": 11234567
    }*/
    //res.send(crearUsuario(nuevoUsuario));
    //res.send(crearMesa('Mesa en node', variableDePrueba, 1));
    //res.send(cerrarConexion());

    //res.setHeader('Content-type', 'text/html');
    //res.sendFile(__dirname + '/public/formTest.html');
});

app.get('/misMesas', function (req, res) {
    //console.log(req.query['idMesa']);
    obtenerMesasDelUsuario(req.query['idMesa'], function (err, mesas) {
        res.send(mesas);
    });

});

app.post('/crearUsuario', (req, res) => {
    delete req.body['Password'];
    //console.log(req.body);
    crearUsuario(req.body, function (err, msg) {
        res.send(msg);
    });

    //res.setHeader('Content-Type', 'text/html');
    //res.send('Usuario creado correctamente');
});

app.get('/mesas', function (req, res) {
    //  res.send('profile with id' + req.params.id)
    //var mesaBuscada = req.query['idMesa'];
    obtenerInfoMesa(req.query['idMesa'], function (err, mesa) {
        res.send(mesa);
    });

});

app.get('/gastos', function (req, res) {
    //  res.send('profile with id' + req.params.id)
    //var mesaBuscada = req.query['idMesa'];
    obtenerGastosMesa(req.query['idMesa'], function (err, gastos) {
        res.send(gastos);
    });
});

app.get('/eliminarUsuario', function (req, res) {
    //  res.send('profile with id' + req.params.id)
    //var mesaBuscada = req.query['idMesa'];
    /*obtenerGastosMesa(req.query['idMesa'], function (err, gastos) {
        res.send(gastos);
    });*/
    eliminarUsuarioDeMesa(req.query['idMesa'], req.query['emailAEliminar'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/usuarioxmail', function (req, res) {
    //  res.send('profile with id' + req.params.id)
    //var mesaBuscada = req.query['idMesa'];
    obtenerUsuarioPorEmail(req.query['emailUsuario'], function (err, usuario) {
        res.send(usuario);
    });
});

app.get('/usuariosxmesa', function (req, res) {
    //  res.send('profile with id' + req.params.id)
    //var mesaBuscada = req.query['idMesa'];
    obtenerUsuariosxMesa(req.query['idMesa'], function (err, usuarios) {
        res.send(usuarios);
    });
});

app.get('/actNombreMesa', function (req, res) {
    /*obtenerUsuariosxMesa(req.query['idMesa'], function (err, usuarios) {
        res.send(usuarios);
    });*/
    actualizarNombreMesa(req.query['idMesa'], req.query['nuevoNombre'], function (err, msg) {
        //console.log('Actualiza el nombre');
        res.send(msg);
    });
});

app.get('/actGasto', function (req, res) {
    actualizarGasto(req.query['idGastoXMesa'], req.query['nuevaInfo'], req.query['idMesa'], function (err, msg) {
        //console.log('Actualiza el nombre');
        res.send(msg);
    });
});

app.get('/agregarUsuario', function (req, res) {
    agregarUsuarioAMesa(req.query['usuarioEnMesa'], req.query['infoUsuario'], function (err, msg) {
        //console.log('Actualiza el nombre');
        res.send(msg);
    });
});

app.get('/agregarGasto', function (req, res) {
    obtenerEmailUsuario(req.query['idUsuario'], function (err, email) {
        crearGasto(req.query['nuevoGasto'], email, function (err, msg) {
            //console.log('Actualiza el nombre');
            res.send(msg);
        });
    })

});

tools.connect();
app.listen(3000);


function crearMesa(nombreMesa, integrantes, idUsuarioCreador) {
    var idMesa;
    tools.query("INSERT INTO mesas (Nombre,IdUsuarioCreador) VALUES (?,?)", [nombreMesa, idUsuarioCreador], function (err, result, fields) {
        if (err) throw err;
        idMesa = result.insertId;
    });
    integrantes.forEach(integrante => {
        var email = integrante['Email'];
        var invitado_id;
        //console.log(email);
        tools.query("SELECT * FROM `usuarios` WHERE Email = ?", [email], function (err, enLaDB, fields) {
            if (err) throw err;
            if (enLaDB.length == 0) {
                tools.query("SELECT UUID()", function (err, result, fields) {
                    if (err) throw err;
                    var UUID = (result[0])['UUID()'];
                    tools.query("INSERT INTO usuarios SET IdUsuario = ?, ?", [UUID, integrante], function (err, insertado, fields) {
                        if (err) throw err;
                        usuario = UUID;
                        tools.query("INSERT INTO usuarioxmesa (emailUsuario,IdMesa) VALUES ( ? , ?)", [email, idMesa], function (err, invitadoEnLaDB, fields) {
                            if (err) throw err;
                        });
                    });
                });
            } else {
                var usuario = enLaDB[0].IdUsuario;
                tools.query("INSERT INTO usuarioxmesa (emailUsuario,IdMesa) VALUES ( ? , ?)", [email, idMesa], function (err, invitadoEnLaDB, fields) {
                    if (err) throw err;
                });
            }

        });
    });

    return 'ok';
}

function cerrarConexion() {
    tools.end();
}

/**bianmazarela@gmail.com*/
function obtenerMesasDelUsuario(idUsuario, callback) {
    obtenerEmailUsuario(idUsuario, function (err, email) {
        tools.query("SELECT * FROM mesas INNER JOIN usuarioxmesa ON emailUsuario = ? AND usuarioxmesa.IdMesa = mesas.IdMesa", [email], function (err, resultado, fields) {
            if (err) throw err;
            callback(null, resultado);
        });
    })

}

function crearUsuario(nuevoUsuario, callback) {
    var msg;
    tools.query("INSERT INTO usuarios SET ? ON DUPLICATE KEY UPDATE IdUsuario = ?, Nombre = ?, Apellido = ?, CVU = ?, CBU = ?, AliasCVU = ?, AliasCBU = ?", [nuevoUsuario], function (err, insertado, fields) {
        if (err) throw err;
        callback(null, 'Cuenta creada con exito');
    });
}

function crearGasto(nuevoGasto, email, callback) {
    tools.query("INSERT INTO gastosxmesa SET emailUsuario = ?, ?", [email, nuevoGasto], function (err, resultado, fields) {
        if (err) throw err;
        dividirGastos(nuevoGasto['IdMesa']);
        callback(null, { 'msg': 'Success' });
    });
}

function obtenerUsuariosDeMesa(idMesa, callback) {
    var resultArray;
    tools.query("SELECT * FROM usuarioxmesa WHERE IdMesa = ?", [idMesa], function (err, resultado, fields) {
        if (err) throw err;
        resultArray = Object.values(JSON.parse(JSON.stringify(resultado)));
        //console.log(resultArray);
        callback(null, resultArray);
    });

}

function obtenerGastoTotalMesa(idMesa, callback) {
    var resultArray;
    tools.query("SELECT SUM(Gasto) FROM gastosxmesa WHERE IdMesa = ?", [idMesa], function (err, resultado, fields) {
        if (err) throw err;
        //console.log(resultado);
        callback(null, (resultado[0])['SUM(Gasto)']);
    });
}

function obtenerCantidadDeUsuarios(idMesa, callback) {
    tools.query("SELECT emailUsuario FROM usuarioxmesa WHERE IdMesa = ?", [idMesa], function (err, resultado, fields) {
        if (err) throw err;
        callback(null, resultado.length);
    });
}

function obtenerGastoTotalUsuario(idMesa, emailUsuario, callback) {
    var gastoTotal;
    //console.log(emailUsuario);
    tools.query("SELECT SUM(Gasto) FROM gastosxmesa WHERE IdMesa = ? AND emailUsuario = ?", [idMesa, emailUsuario], function (err, gastosDeLaMesa, fields) {
        //console.log(gastosDeLaMesa);
        if (err) throw err;
        if ((gastosDeLaMesa[0])['SUM(Gasto)'] == null) {
            gastoTotal = 0;
        } else {
            gastoTotal = (gastosDeLaMesa[0])['SUM(Gasto)'];
        }
        callback(null, gastoTotal);

    });
}

function obtenerEmailUsuario(idUsuario, callback) {
    console.log(idUsuario);
    tools.query("SELECT Email FROM usuarios WHERE IdUsuario = ?", [idUsuario], function (err, resultado, fields) {
        if (err) throw err;
        var emailUsuario = ((resultado[0])['Email']);
        callback(null, emailUsuario);
    });
}

function dividirGastos(idMesa) {
    obtenerUsuariosDeMesa(idMesa, function (err, usuariosDeLaMesa) {
        obtenerCantidadDeUsuarios(idMesa, function (err, cantidadDeUsuariosEnLaMesa) {
            obtenerGastoTotalMesa(idMesa, function (err, deudaTotalDeLaMesa) {
                usuariosDeLaMesa.forEach(integrante => {
                    var deudaIndividual = (deudaTotalDeLaMesa / cantidadDeUsuariosEnLaMesa) * (-1);
                    //console.log(deudaIndividual);
                    var emailUsuario = integrante['emailUsuario'];
                    obtenerGastoTotalUsuario(idMesa, emailUsuario, function (err, gastoTotal) {
                        deudaIndividual += gastoTotal;
                        //console.log(gastoTotal);
                        //var aInsertar = [emailUsuario => deudaIndividual];
                        tools.query("UPDATE usuarioxmesa SET Gasto = ? WHERE emailUsuario = ? AND IdMesa = ?", [deudaIndividual, emailUsuario, idMesa], function (err, resultado, fields) {
                            if (err) throw err;
                        });
                    });
                })
            });
        });
    });
}

function obtenerInfoMesa(idMesa, callback) {
    tools.query("SELECT * FROM mesas WHERE IdMesa = ?", [idMesa], function (err, resultado, fields) {
        if (err) throw err;
        callback(null, resultado[0]);
    });
}

function obtenerGastosMesa(idMesa, callback) {
    tools.query("SELECT gastosxmesa.*,usuarios.* FROM gastosxmesa JOIN usuarios on gastosxmesa.emailUsuario = usuarios.Email AND gastosxmesa.IdMesa = ?", [idMesa], function (err, resultado, fields) {
        if (err) throw err;
        callback(null, resultado);
    });
}

function obtenerUsuarioPorEmail(emailUsuario, callback) {
    //console.log(emailUsuario);
    tools.query("SELECT IdUsuario,Nombre,Apellido FROM usuarios WHERE Email = ?", [emailUsuario], function (err, resultado, fields) {
        if (err) throw err;
        callback(null, resultado[0]);
    });
}

function obtenerUsuariosxMesa(idMesa, callback) {
    tools.query("SELECT usuarioxmesa.Gasto,usuarios.* FROM usuarioxmesa JOIN usuarios on usuarioxmesa.emailUsuario = usuarios.Email AND usuarioxmesa.IdMesa = ?", [idMesa], function (err, resultado, fields) {
        if (err) throw err;
        //console.log(resultado);
        callback(null, resultado);
    });
}

function actualizarNombreMesa(idMesa, nuevoNombre, callback) {
    tools.query("UPDATE mesas SET Nombre = ? WHERE IdMesa = ?", [nuevoNombre, idMesa], function (err, resultado, fields) {
        if (err) throw err;
        callback(null, { 'msg': 'Success' });
    });
}

function eliminarUsuarioDeMesa(idMesa, emailUsuario, callback) {
    tools.query("DELETE FROM usuarioxmesa WHERE IdMesa = ? AND emailUsuario = ?", [idMesa, emailUsuario], function (err, resultado, fields) {
        if (err) throw err;
        tools.query("DELETE FROM gastosxmesa WHERE IdMesa = ? AND emailUsuario = ?", [idMesa, emailUsuario], function (err, resultado, fields) {
            if (err) throw err;
            dividirGastos();
            callback(null, { 'msg': 'Success' });
        });
    });
}

function actualizarGasto(idGastoxMesa, nuevaInfo, idMesa, callback) {
    tools.query("UPDATE gastosxmesa SET Gasto = ?, Descripcion = ? WHERE IdGastoXMesa = ?", [nuevaInfo['Gasto'], nuevaInfo['Descripcion'], idGastoxMesa], function (err, resultado, fields) {
        if (err) {
            throw err
        } else {
            dividirGastos(idMesa);
            callback(null, { 'msg': 'Success' });
        };

    });
}

function agregarUsuarioAMesa(usuarioEnMesa, usuario, callback) {
    tools.query("INSERT INTO usuarioxmesa SET ?", [usuarioEnMesa], function (err, resultado, fields) {
        if (err) { throw err } else {
            tools.query("INSERT INTO usuarios SET IdUsuario = UUID(), ? ON DUPLICATE KEY UPDATE IdUsuario=IdUsuario", [usuario], function (err, resultado, fields) {
                if (err) { throw err } else {
                    dividirGastos(usuarioEnMesa['idMesa']);
                    callback(null, { 'msg': 'Success' });
                }
            });
        }
    });
}