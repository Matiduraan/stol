var express = require('express');
var app = express();
var tools = require('./dbconnection.js');

let variableDePrueba = [
    {
        'email': "matiduraan@gmail.com"
    },
    {
        'email': "bianmazarela@gmail.com"
    },
    {
        'email': "maildeprueba@gmail.com"
    },
]

app.get('/', function (req, res) {
    res.send(crearUsuario(12345, 123456, 'CVU', 'CBU', 'bianmazarela@gmail.com', 1138054078));
    //res.send(crearMesa('Mesa en node', variableDePrueba, 1));
    //res.send(cerrarConexion());
})
tools.connect();
app.listen(3000);

function probarConexion() {
    //var gastosDeLaMesa = mysqli_query(tools.connection, "SELECT Gasto FROM gastosxmesa WHERE IdMesa = $idMesa");
    var resultadoQuery
    tools.query("SELECT Gasto FROM gastosxmesa", function (err, result, fields) {
        if (err) throw err;
        resultadoQuery = result;
        console.log(resultadoQuery);
    });
    return resultadoQuery;

}

function crearMesa(nombreMesa, integrantes, idUsuarioCreador) {
    var idMesa;
    tools.query("INSERT INTO mesas (Nombre,IdUsuarioCreador) VALUES (?,?)", [nombreMesa, idUsuarioCreador], function (err, result, fields) {
        if (err) throw err;
        idMesa = result.insertId;
    });
    integrantes.forEach(integrante => {
        var email = integrante['email'];
        var invitado_id;
        tools.query("SELECT * FROM `usuarios` WHERE Email = ?", [email], function (err, enLaDB, fields) {
            if (err) throw err;
            if (enLaDB.length == 0) {
                tools.query("SELECT * FROM `invitados` WHERE Email = ?", [email], function (err, invitadoEnLaDB, fields) {
                    if (err) throw err;

                    if (invitadoEnLaDB.length == 0) {
                        tools.query("INSERT INTO invitados (email) VALUES (?)", [email], function (err, invitadoEnLaDB2, fields) {
                            if (err) throw err;
                            invitado_id = invitadoEnLaDB2.insertId;
                        });

                    } else {
                        var row = invitadoEnLaDB[0];
                        invitado_id = row.IdInvitado;
                    }
                    tools.query("INSERT INTO usuarioxmesa (IdUsuario,IdMesa,EsInvitado) VALUES ( ? , ?, 1 )", [invitado_id, idMesa], function (err, invitadoEnLaDB, fields) {
                        if (err) throw err;
                    });
                });
            } else {
                var usuario = enLaDB[0];
                tools.query("INSERT INTO usuarioxmesa (IdUsuario,IdMesa,EsInvitado) VALUES ( ? , ?, 0 )", [usuario.IdUsuario, idMesa], function (err, invitadoEnLaDB, fields) {
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
function obtenerMesasDelUsuario(idUsuario) {
    tools.query("SELECT Nombre FROM mesas INNER JOIN usuarioxmesa ON IdUsuario = ? AND EsInvitado = 0 AND usuarioxmesa.IdMesa = mesas.IdMesa", [idUsuario], function (err, resultado, fields) {
        if (err) throw err;
        return resultado;
    });
}

function crearUsuario(CVU, CBU, AliasCvu, AliasCbu, email, telefono) {
    tools.query("SELECT IdUsuario FROM usuarios WHERE email = ?", [email], function (err, resultado, fields) {
        if (err) throw err;
        console
        if (resultado.length == 0) {
            var idAgregado;

            tools.query("INSERT INTO usuarios (CVU,CBU,AliasCVU,AliasCBU,Email,Telefono) VALUES ( ?, ?, ?, ?, ?, ? )", [CVU, CBU, AliasCvu, AliasCbu, email, telefono], function (err, insertado, fields) {
                if (err) throw err;
                idAgregado = insertado.insertId;
                tools.query("UPDATE usuarioxmesa INNER JOIN invitados ON usuarioxmesa.IdUsuario = invitados.IdInvitado AND usuarioxmesa.EsInvitado = 1 SET EsInvitado = 0, IdUsuario = ? ", [idAgregado], function (err, resultado, fields) {
                    if (err) throw err;
                    console.log(resultado);
                });
                eliminarInvitado(email);
            });
            return 'ok';
        } else {
            return 'La cuenta ya existe';
        }
    });
}

function eliminarInvitado(emailInvitado) {
    tools.query("DELETE FROM invitados WHERE email = ?", [emailInvitado], function (err, resultado, fields) {
        if (err) throw err;
    });
}

function crearGasto(emailUsuario, monto, mesa) {
    tools.query("INSERT INTO gastosxmesa (Gasto,IdMesa,emailUsuario) VALUES (?,?,?)", [monto, mesa, emailUsuario], function (err, resultado, fields) {
        if (err) throw err;
    });
}

function obtenerUsuariosDeMesa(idMesa) {
    tools.query("SELECT * FROM usuarioxmesa WHERE IdMesa = ?", [idMesa], function (err, resultado, fields) {
        if (err) throw err;
        return resultado;
    });
}

function obtenerGastoTotalMesa(idMesa) {
    tools.query("SELECT SUM(Gasto) FROM gastosxmesa WHERE IdMesa = ?", [idMesa], function (err, resultado, fields) {
        if (err) throw err;
        console.log(resultado);
    });
}

/** 

function Obtener_gasto_total_mesa($idMesa)
{
    require get_template_directory() . '/inc/connectdb.php';
    $gastosDeLaMesa = mysqli_query($enlace, "SELECT Gasto FROM gastosxmesa WHERE IdMesa = $idMesa");
    $row = mysqli_fetch_array($gastosDeLaMesa);
    $gastoTotal = array_sum($row);
    mysqli_close($enlace);
    return $gastoTotal;
}

function obtener_cantidad_de_usuarios($idMesa)
{
    require get_template_directory() . '/inc/connectdb.php';
    //$resultado = mysqli_query($enlace, "SELECT Nombre FROM mesas WHERE EXISTS ( SELECT IdMesa FROM usuarioxmesa WHERE IdUsuario = $idUsuario AND EsInvitado = 0 AND IdMesa = mesas.IdMesa )");
    $resultado = mysqli_query($enlace, "SELECT IdUsuario FROM usuarioxmesa WHERE IdMesa = $idMesa");
    //var_dump($resultado);
    mysqli_close($enlace);
    return mysqli_num_rows($resultado);
}

function obtener_gasto_total_del_usuario($idMesa, $emailUsuario)
{
    require get_template_directory() . '/inc/connectdb.php';
    $gastosDeLaMesa = mysqli_query($enlace, "SELECT Gasto FROM gastosxmesa WHERE IdMesa = $idMesa AND emailUsuario = '$emailUsuario'");
    if (mysqli_num_rows($gastosDeLaMesa) > 0) {
        $row = mysqli_fetch_array($gastosDeLaMesa);
        $gastoTotal = array_sum($row);
    } else {
        $gastoTotal = 0;
    }

    mysqli_close($enlace);
    return $gastoTotal;
} **/