
const config = require("../config");
const express = require("express");
const mysql = require("./mysql");
const _ = require("lodash");

const QUERY_TABLES = "select * from INFORMATION_SCHEMA.TABLES";

function morozov({ trace = false }) {
    const router = new express.Router();

    if (trace) {
        router.use(function (req, res, next) {
            console.log(req.method, req.url, _.isEmpty(req.body) ? '' : JSON.stringify(req.body));
            next();
        });
    }

    router.get("/about", function (req, res) {
        res.json({
            ok: true,
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            config
        });
    });

    router.get("/tables", function (req, res) {
        mysql.query(QUERY_TABLES, function (error, items, fields) {
            if (error) {
                res.status(503).json({ error });
            }
            else {
                res.json({
                    ok: true,
                    fields,
                    items: items.filter(item => config.mysql.database === item.TABLE_SCHEMA)
                })
            }
        })
    });

    return router;
}

module.exports = morozov;
