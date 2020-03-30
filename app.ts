import { app, BrowserWindow } from 'electron';
import SystemTrayInfo from './main';
new SystemTrayInfo(app, BrowserWindow);