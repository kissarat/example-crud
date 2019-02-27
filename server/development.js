
const config = require("../config");
const express = require("express");
const mysql = require("./mysql");

const QUERY_TABLES = "select * from INFORMATION_SCHEMA.TABLES";

function development() {
    const api = new express.Router();

    api.get("/config", function (req, res) {
        res.json({ ok: true, item: config });
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

module.exports = development;
