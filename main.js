"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var request_1 = __importDefault(require("request"));
var moment_1 = __importDefault(require("moment"));
var path_1 = __importDefault(require("path"));
var systeminformation_1 = __importDefault(require("systeminformation"));
var ETHERSCAN_API_KEY = 'I72EM35CDD1YYHBHNA5RGIT2C7J1FMRKGT';
var SystemTrayInfo = /** @class */ (function () {
    function SystemTrayInfo() {
        this.ethUSDT = { assetname: 'ETHUSDT', assetvalue: '' };
        this.init();
    }
    SystemTrayInfo.prototype.init = function () {
        if (electron_1.app !== undefined) {
            this.app = electron_1.app;
            this.app.on('ready', this.initApplication());
        }
        else {
            throw new Error("Electron App not defined.");
        }
    };
    SystemTrayInfo.prototype.initApplication = function () {
        var _this = this;
        var trayIcon = path_1.default.join(__dirname, 'tick.png');
        this.tray = new electron_1.Tray(trayIcon);
        this.tray.setTitle('Getting market price of ETHUSD...');
        this.tray.setToolTip('System details...');
        var contextMenu = electron_1.Menu.buildFromTemplate([
            { label: 'CPU', type: 'normal', click: this.getSystemInformation },
            { label: 'Update', type: 'normal', click: this.updatePrice },
            { label: 'Quit', click: function () { _this.app.quit(); } },
        ]);
        this.updatePrice();
        this.getSystemInformation();
        this.tray.setContextMenu(contextMenu);
    };
    SystemTrayInfo.prototype.getSystemInformation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, networkData, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, systeminformation_1.default.cpu()];
                    case 1:
                        data = _a.sent();
                        console.log('CPU Information:');
                        console.log(data);
                        console.log('.............');
                        return [4 /*yield*/, systeminformation_1.default.networkStats()];
                    case 2:
                        networkData = _a.sent();
                        console.log('Network Stats ');
                        console.log(networkData);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    SystemTrayInfo.prototype.updatePrice = function () {
        var _this = this;
        var url = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=' + ETHERSCAN_API_KEY;
        request_1.default({
            url: url,
        }, function (err, res, body) {
            console.log(body);
            if (err) {
                _this.tray.setToolTip('Error getting market price.');
            }
            else {
                _this.ethUSDT.assetvalue = JSON.parse(body).result.ethusd;
                var timestamp = moment_1.default().format('YYYY-MM-DD HH:mm');
                _this.tray.setToolTip("$" + _this.ethUSDT.assetvalue + " as of " + timestamp);
            }
        });
    };
    return SystemTrayInfo;
}());
exports.SystemTrayInfo = SystemTrayInfo;
