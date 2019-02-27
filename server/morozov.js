
const config = require("../config");
const express = require("express");
const mysql = require("./mysql");
const _ = require("lodash");

const QUERY_TABLES = "select * from INFORMATION_SCHEMA.TABLES";

function morozov({ trace = false }) {
    const api = new express.Router();

    if (trace) {
        api.use(function (req, res, next) {
            console.log(req.method, req.url, _.isEmpty(req.body) ? '' : JSON.stringify(req.body));
            next();
        });
    }

    api.get("/about", function (req, res) {
        res.json({
            ok: true,
            isAuthenticated: req.isAuthenticated(),
            user: req.user,
            config
        });
    });

    api.get("/tables", function (req, res) {
        mysql.query(QUERY_TABLES, function (error, items, fields) {
            if (error) {
                res.status(503).json({ error });
            }
            else {
                res.json({
                    ok: true,
                    fields,
                    items: items.filter(item => "information_schema" !== item.TABLE_SCHEMA)
                })
            }
        })
    });

    return api;
}

module.exports = morozov;
