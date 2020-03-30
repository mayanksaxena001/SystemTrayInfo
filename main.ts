import { app, Tray, Menu, BrowserWindow } from 'electron';
import request from 'request';
import moment from 'moment';
import path from 'path';
import sysInfo from 'systeminformation';
interface CryptoAsset {
  assetname: String,
  assetvalue: String
}
const ETHERSCAN_API_KEY = 'I72EM35CDD1YYHBHNA5RGIT2C7J1FMRKGT';
export class SystemTrayInfo {
  tray: any;
  app: any;
  ethUSDT: CryptoAsset = { assetname: 'ETHUSDT', assetvalue: '' }
  constructor() {
    this.init();
  }
  init() {
    if (app !== undefined) {
      this.app = app;
      this.app.on('ready', this.initApplication());
    } else {
      throw new Error("Electron App not defined.");

    }
  }
  initApplication(): any {
    const trayIcon = path.join(__dirname, 'tick.png');
    this.tray = new Tray(trayIcon);

    this.tray.setTitle('Getting market price of ETHUSD...');
    this.tray.setToolTip('System details...');
    const contextMenu = Menu.buildFromTemplate([
      { label: 'CPU', type: 'normal', click: this.getSystemInformation },
      { label: 'Update', type: 'normal', click: this.updatePrice },
      { label: 'Quit', click: () => { this.app.quit(); } },
    ]);
    this.updatePrice();
    this.getSystemInformation();
    this.tray.setContextMenu(contextMenu);
  }
  async getSystemInformation() {
    try {
      const data = await sysInfo.cpu();
      console.log('CPU Information:');
      console.log(data);
      console.log('.............');
      const networkData = await sysInfo.networkStats();
      console.log('Network Stats ');
      console.log(networkData);
    }
    catch (e) {
      console.log(e);
    }
  }
  updatePrice() {
    const url = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=' + ETHERSCAN_API_KEY;
    request({
      url: url,
    }, (err, res, body) => {
      console.log(body);
      if (err) {
        this.tray.setToolTip('Error getting market price.');
      } else {
        this.ethUSDT.assetvalue = JSON.parse(body).result.ethusd;
        const timestamp = moment().format('YYYY-MM-DD HH:mm');
        this.tray.setToolTip(`$${this.ethUSDT.assetvalue} as of ${timestamp}`);
      }
    });
  }
}


