var express = require('express');
var fs = require('fs');
var path = require('path');
const { getMaxListeners } = require('./dbconnection.js');
const bodyParser = require('body-parser');
var tools = require('./dbconnection.js');
const { send } = require('process');
const res = require('express/lib/response');
var fs = require('fs');
var dir = './integrantesPatagonia/';

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
        'Nombre': "Anahi Melisa Lopez"
    },
    {
        'Nombre': "Antonella Rotelli"
    },
    {
        'Nombre': "Barbara Figura"
    },
    {
        'Nombre': "Carlos Vidal"
    },
    {
        'Nombre': "Cristian Gomez"
    },
    {
        'Nombre': "David Lopez"
    },
    {
        'Nombre': "Demian Campo"
    },
    {
        'Nombre': "Emanuel Sonego"
    },
    {
        'Nombre': "Enzo Ricciardi"
    },
    {
        'Nombre': "Fernando Bua Carrera"
    },
    {
        'Nombre': "Florencia Dato"
    },
    {
        'Nombre': "Gabriel Herrera"
    },
    {
        'Nombre': "Gaston Bua Bonaldi"
    },
    {
        'Nombre': "German Amitrano"
    },
    {
        'Nombre': "Gustavo Di Corrado"
    },
    {
        'Nombre': "Ivan Mancuello"
    },
    {
        'Nombre': "Ivan Raffa"
    },
    {
        'Nombre': "Joaquin Bua Bonaldi"
    },
    {
        'Nombre': "Juan Contreras"
    },
    {
        'Nombre': "Juan Ignacio Bua"
    },
    {
        'Nombre': "Karen Torrico"
    },
    {
        'Nombre': "Laura Torrico"
    },
    {
        'Nombre': "Malena Olivieri"
    },
    {
        'Nombre': "Mariano Varela"
    },
    {
        'Nombre': "Matias Bori"
    },
    {
        'Nombre': "Miguel Sanchez"
    },
    {
        'Nombre': "Nick Palacios"
    },
    {
        'Nombre': "Nicolas Mezzanotte"
    },
    {
        'Nombre': "Pablo Fornillo"
    },
    {
        'Nombre': "Pablo Agustin Jara Prytula"
    },
    {
        'Nombre': "Pedro Etchart"
    },
    {
        'Nombre': "Pedro Molinari"
    },
    {
        'Nombre': "Rafael Fariña"
    },
    {
        'Nombre': "Santiago Hildebrandt"
    },
    {
        'Nombre': "Tomas Melo"
    },
    {
        'Nombre': "Tomas Melo"
    },
]

app.get('/', function (req, res) {
    //res.send(dividirGastos(16));
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

    variableDePrueba.forEach(persona => {
        var nombrePersona = persona['Nombre'];
        if (!fs.existsSync(dir + nombrePersona)) {
            fs.mkdirSync(dir + nombrePersona);
        }
    });
    /*var nombrePersona = 'Matias Duran';
    console.log(dir + nombrePersona);
    if (!fs.existsSync(dir + nombrePersona)) {
        fs.mkdirSync(dir + nombrePersona);
    }*/


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
    obtenerUsuariosxMesa(req.query['idMesa'], function (err, usuarios) {
        res.send(usuarios);
    });
});

app.get('/actNombreMesa', function (req, res) {
    actualizarNombreMesa(req.query['idMesa'], req.query['nuevoNombre'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/actGasto', function (req, res) {
    actualizarGasto(req.query['idGastoXMesa'], req.query['nuevaInfo'], req.query['idMesa'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/agregarUsuario', function (req, res) {
    agregarUsuarioAMesa(req.query['usuarioEnMesa'], req.query['infoUsuario'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/agregarGasto', function (req, res) {
    obtenerEmailUsuario(req.query['idUsuario'], function (err, email) {
        crearGasto(req.query['nuevoGasto'], email, function (err, msg) {
            res.send(msg);
        });
    })
});

app.get('/registrarPago', function (req, res) {
    obtenerEmailUsuario(req.query['Pagador'], function (err, email) {
        registrarPago(email, req.query['Recibidor'], req.query['Monto'], req.query['IdMesa'], function (err, msg) {
            res.send(msg);
        });
    })
});

app.get('/eliminarGasto', function (req, res) {
    eliminarGasto(req.query['idGastoxMesa'], req.query['idMesa'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/historialPagos', function (req, res) {
    obtenerHistorialPagos(req.query['idMesa'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/nombreUsuario', function (req, res) {
    obtenerNombreUsuario(req.query['emailUsuario'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/eliminarPago', function (req, res) {
    eliminarPago(req.query['idPago'], req.query['idMesa'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/crearMesa', function (req, res) {
    crearMesa(req.query['nombreMesa'], req.query['integrantes'], req.query['idUsuarioCreador'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/infoUsuario', function (req, res) {
    obtenerInfoUsuario(req.query['uid'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/vincularMercadopago', function (req, res) {
    vincularMercadopago(req.query['uid'], req.query['usuario'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/infoMP', function (req, res) {
    obtenerInfoMercadopago(req.query['email'], function (err, msg) {
        res.send(msg);
    });
});

app.get('/desvincularMP', function (req, res) {
    desvincularMP(req.query['uid'], function (err, msg) {
        res.send(msg);
    });
});


tools.connect();
app.listen(3000);


function crearMesa(nombreMesa, integrantes, idUsuarioCreador, callback) {
    var idMesa;
    tools.query("INSERT INTO mesas (Nombre,IdUsuarioCreador,fechaCreacion) VALUES (?,?,CURDATE())", [nombreMesa, idUsuarioCreador], function (err, result, fields) {
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
    callback(null, { 'msg': 'Success' });
}

function cerrarConexion() {
    tools.end();
}

function obtenerMesasDelUsuario(idUsuario, callback) {
    obtenerEmailUsuario(idUsuario, function (err, email) {
        tools.query("SELECT * FROM mesas INNER JOIN usuarioxmesa ON emailUsuario = ? AND usuarioxmesa.IdMesa = mesas.IdMesa", [email], function (err, resultado, fields) {
            if (err) throw err;
            callback(null, resultado);
        });
    })

}

function crearUsuario(nuevoUsuario, callback) {
    //console.log(nuevoUsuario);
    tools.query("INSERT INTO usuarios SET ? ON DUPLICATE KEY UPDATE ?", [nuevoUsuario, nuevoUsuario], function (err, insertado, fields) {
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
        var gastoDeLaMesa = (resultado[0])['SUM(Gasto)'];
        tools.query("UPDATE mesas SET gastoTotal = ? WHERE IdMesa = ?", [gastoDeLaMesa, idMesa], function (err, resultado, fields) {
            if (err) throw err;
            callback(null, { 'msg': 'Success' });
        });
        callback(null, gastoDeLaMesa);
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
    //console.log(idUsuario);
    tools.query("SELECT Email FROM usuarios WHERE IdUsuario = ?", [idUsuario], function (err, resultado, fields) {
        if (err) throw err;
        var emailUsuario = ((resultado[0])['Email']);
        callback(null, emailUsuario);
    });
}

function obtenerResultadoPagosUsuario(idMesa, emailUsuario, callback) {
    tools.query("SELECT SUM(monto) FROM pagos WHERE emailPagador = ? AND IdMesa = ?", [emailUsuario, idMesa], function (err, pago, fields) {
        if (err) throw err;
        //console.log((pago[0])['SUM(monto)']);
        if ((pago[0])['SUM(monto)'] == null) {
            pago = 0;
        } else {
            pago = (pago[0])['SUM(monto)'];
        }
        tools.query("SELECT SUM(monto) FROM pagos WHERE emailReceptor = ? AND IdMesa = ?", [emailUsuario, idMesa], function (err, recibio, fields) {
            if (err) throw err;
            if ((recibio[0])['SUM(monto)'] == null) {
                recibio = 0;
            } else {
                recibio = (recibio[0])['SUM(monto)']
            }
            var resultado = pago - recibio;
            callback(null, resultado);
        });
    });
}

function dividirGastos(idMesa) {
    obtenerUsuariosDeMesa(idMesa, function (err, usuariosDeLaMesa) {
        obtenerCantidadDeUsuarios(idMesa, function (err, cantidadDeUsuariosEnLaMesa) {
            obtenerGastoTotalMesa(idMesa, function (err, deudaTotalDeLaMesa) {
                usuariosDeLaMesa.forEach(integrante => {
                    var deudaIndividual = (deudaTotalDeLaMesa / cantidadDeUsuariosEnLaMesa) * (-1);
                    var emailUsuario = integrante['emailUsuario'];
                    obtenerGastoTotalUsuario(idMesa, emailUsuario, function (err, gastoTotal) {
                        deudaIndividual += gastoTotal;
                        obtenerResultadoPagosUsuario(idMesa, emailUsuario, function (err, resultadoPagos) {
                            //console.log(resultadoPagos);
                            deudaIndividual += resultadoPagos;
                            tools.query("UPDATE usuarioxmesa SET Gasto = ? WHERE emailUsuario = ? AND IdMesa = ?", [deudaIndividual, emailUsuario, idMesa], function (err, resultado, fields) {
                                if (err) throw err;
                            });
                        })
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

function registrarPago(pagador, recibidor, monto, idMesa, callback) {
    tools.query("INSERT INTO pagos SET emailPagador = ?, emailReceptor = ?, monto = ?,idMesa = ?,fechaDePago = CURDATE()", [pagador, recibidor, monto, idMesa], function (err, resultado, fields) {
        if (err) { throw err } else {
            dividirGastos(idMesa);
            callback(null, { 'msg': 'Success' });
        }
    });
}

function eliminarGasto(idGastoXMesa, idMesa, callback) {
    tools.query("DELETE FROM gastosxmesa WHERE IdGastoXMesa = ?", [idGastoXMesa], function (err, resultado, fields) {
        if (err) throw err;
        dividirGastos(idMesa);
        callback(null, { 'msg': 'Success' });
    });
}

function obtenerHistorialPagos(idMesa, callback) {
    tools.query("SELECT * FROM pagos WHERE idMesa = ?", [idMesa], function (err, resultado, fields) {
        if (err) throw err;
        //console.log(resultado);
        callback(null, resultado);
    });
}

function obtenerNombreUsuario(emailUsuario, callback) {
    tools.query("SELECT Nombre, Apellido FROM usuarios WHERE Email = ?", [emailUsuario], function (err, resultado, fields) {
        if (err) throw err;
        var result = (resultado[0])['Nombre'] + ' ' + (resultado[0])['Apellido'];
        callback(null, result);
    });
}

function eliminarPago(idPago, idMesa, callback) {
    tools.query("DELETE FROM pagos WHERE idPago = ?", [idPago], function (err, resultado, fields) {
        if (err) throw err;
        dividirGastos(idMesa);
        callback(null, { 'msg': 'Success' });
    });
}

function obtenerInfoUsuario(uid, callback) {
    tools.query("SELECT * FROM usuarios WHERE IdUsuario = ?", [uid], function (err, resultado, fields) {
        if (err) throw err;
        callback(null, resultado[0]);
    });
}

function vincularMercadopago(uid, infoMercadopago, callback) {
    tools.query("UPDATE usuarios SET ? WHERE IdUsuario = ?", [infoMercadopago, uid], function (err, resultado, fields) {
        if (err) {
            throw err
        } else {
            callback(null, { 'msg': 'Success' });
        };

    });
}

function obtenerInfoMercadopago(email, callback) {
    tools.query("SELECT PublicKey,AccessToken,RefreshToken FROM usuarios WHERE Email = ?", [email], function (err, resultado, fields) {
        if (err) throw err;
        callback(null, resultado[0]);
    });
}

function desvincularMP(uid, callback) {
    tools.query("UPDATE usuarios SET AccessToken = null,RefreshToken=null,PublicKey=null WHERE IdUsuario = ?", [uid], function (err, resultado, fields) {
        if (err) {
            throw err
        } else {
            callback(null, { 'msg': 'Success' });
        };

    });
}

function csvToJson() {
    // Reading the file using default
    // fs npm package
    csv = fs.readFileSync("./integrantesPatagonia/integrantes.csv")

    // Convert the data to String and
    // split it in an array
    var array = csv.toString().split("\r");

    // All the rows of the CSV will be
    // converted to JSON objects which
    // will be added to result in an array
    let result = [];

    // The array[0] contains all the
    // header columns so we store them
    // in headers array
    let headers = array[0].split(", ")

    // Since headers are separated, we
    // need to traverse remaining n-1 rows.
    for (let i = 1; i < array.length - 1; i++) {
        let obj = {}

        // Create an empty object to later add
        // values of the current row to it
        // Declare string str as current array
        // value to change the delimiter and
        // store the generated string in a new
        // string s
        let str = array[i]
        let s = ''

        // By Default, we get the comma separated
        // values of a cell in quotes " " so we
        // use flag to keep track of quotes and
        // split the string accordingly
        // If we encounter opening quote (")
        // then we keep commas as it is otherwise
        // we replace them with pipe |
        // We keep adding the characters we
        // traverse to a String s
        let flag = 0
        for (let ch of str) {
            if (ch === '"' && flag === 0) {
                flag = 1
            }
            else if (ch === '"' && flag == 1) flag = 0
            if (ch === ', ' && flag === 0) ch = '|'
            if (ch !== '"') s += ch
        }

        // Split the string using pipe delimiter |
        // and store the values in a properties array
        let properties = s.split("|")

        // For each header, if the value contains
        // multiple comma separated data, then we
        // store it in the form of array otherwise
        // directly the value is stored
        for (let j in headers) {
            if (properties[j].includes(", ")) {
                obj[headers[j]] = properties[j]
                    .split(", ").map(item => item.trim())
            }
            else obj[headers[j]] = properties[j]
        }

        // Add the generated object to our
        // result array
        result.push(obj)
    }

    // Convert the resultant array to json and
    // generate the JSON output file.
    let json = JSON.stringify(result);
    console.log(json);
}