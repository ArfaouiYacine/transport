"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var transport_model_1 = __importDefault(require("./transport.model"));
var body_parser_1 = __importDefault(require("body-parser"));
var app = (0, express_1["default"])();
var PORT = process.env.PORT || 3000;
var eurekaHelper = require('./eureka-helper');
app.listen(PORT, function () {
    console.log("transport-server on 3000");
});
eurekaHelper.registerWithEureka('transport-server', PORT);
app.use(body_parser_1["default"].json());
var uri = "mongodb://localhost:27017/transports";
mongoose_1["default"].connect(uri, function (err) {
    if (err)
        console.log(err);
    else
        console.log("Mongo Database connected successfuly");
});
app.get("/transports", function (req, resp) {
    transport_model_1["default"].find(function (err, transports) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(transports);
    });
});
app.get("/transports/:id", function (req, resp) {
    transport_model_1["default"].findById(req.params.id, function (err, transport) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(transport);
    });
});
app.put("/transports/:id", function (req, resp) {
    var transport = transport_model_1["default"].findByIdAndUpdate(req.params.id, req.body, function (err) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("transport update");
    });
});
app["delete"]("/transports/:id", function (req, resp) {
    var transport = transport_model_1["default"].findByIdAndDelete(req.params.id, req.body, function (err) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send("transport deleted");
    });
});
app.get('/transportsSearch', function (req, res) {
    var _a, _b;
    var search = req.query.search || '';
    var page = parseInt(((_a = req.query.page) === null || _a === void 0 ? void 0 : _a.toString()) || '1');
    var size = parseInt(((_b = req.query.size) === null || _b === void 0 ? void 0 : _b.toString()) || '5');
    transport_model_1["default"].paginate({ title: { $regex: ".*(?i)" + search + ".*" } }, { page: page, limit: size }, function (err, transports) {
        if (err)
            res.status(500).send(err);
        else
            res.send(transports);
    });
});
app.post("/transports", function (req, resp) {
    var transport = new transport_model_1["default"](req.body);
    transport.save(function (err) {
        if (err)
            resp.status(500).send(err);
        else
            resp.send(transport);
    });
});
app.get("/", function (req, resp) {
    resp.send("MCHA YACINE MCHA");
});
app.listen(8085, function () {
    console.log("server srtared");
});
