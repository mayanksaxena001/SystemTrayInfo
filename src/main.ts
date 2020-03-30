import { Tray, Menu, BrowserWindow } from 'electron';
import request from 'request';
import moment from 'moment';
import path from 'path';
import sysInfo from 'systeminformation';
import { CryptoAsset } from './CryptoAsset';

const ETHERSCAN_API_KEY = 'I72EM35CDD1YYHBHNA5RGIT2C7J1FMRKGT';
export default class SystemTrayInfo {
  private static tray: any;
  app: Electron.App;
  browserWindow: any;
  private static ethUSDT: CryptoAsset = { assetname: 'ETHUSDT', assetvalue: '' }
  constructor(app: Electron.App, browserWindow: typeof BrowserWindow) {
    this.app = app;
    this.browserWindow = browserWindow;
    if (this.app !== undefined) {
      this.app.on('ready', () => this.initApplication());
    } else {
      throw new Error("Electron App not defined.");
    }
  }
  private initApplication() {
    // this.browserWindow = new BrowserWindow({ width: 800, height: 600, frame: false });
    const trayIcon = path.join(__dirname, 'assets/tick.png');
    SystemTrayInfo.tray = new Tray(trayIcon);
    SystemTrayInfo.tray.setTitle('Getting market price of ETHUSD...');
    SystemTrayInfo.tray.setToolTip('System details...');
    const contextMenu = Menu.buildFromTemplate([
      { label: 'CPU', type: 'normal',toolTip:'Cpu Details', click: this.getSystemInformation },
      { label: 'Update', type: 'normal',accelerator:'CommandOrControl+U', click: this.updatePrice },
      { label: 'Quit', click: () => { this.app.quit(); } },
    ]);
    SystemTrayInfo.tray.setContextMenu(contextMenu);
    // this.updatePrice();
    // this.getSystemInformation();
  }
  private async getSystemInformation() {
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
  private updatePrice() {
    const url = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey=' + ETHERSCAN_API_KEY;
    request({
      url: url,
    }, (err, _res, body) => {
      console.log(body);
      try {
        if (err) {
          SystemTrayInfo.tray.setToolTip('Error getting market price.');
        } else {
          SystemTrayInfo.ethUSDT.assetvalue = JSON.parse(body).result.ethusd;
          const timestamp = moment().format('YYYY-MM-DD HH:mm');
          SystemTrayInfo.tray.setToolTip(`$${SystemTrayInfo.ethUSDT.assetvalue} as of ${timestamp}`);
        }
      }
      catch (err) {
        console.log(err);
      }
    });
  }
}


