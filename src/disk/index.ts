import * as dirTree from 'directory-tree';
import { consoleLogger, ILogger } from '../utils/logger';
const diskusage = require('diskusage-ng');

type IDiskInfoError = Error | string;

interface IDiskInfo {
  total: number;
  available: number;
  used: number;
}

interface IDirTreeItem {
  path: string;
}

export const showDirectoryStatus = async (
  directory: string = '/tmp',
  logger: ILogger = consoleLogger,
) =>
  new Promise<void>(resolve => {
    diskusage(directory, (err: IDiskInfoError, info: IDiskInfo) => {
      if (err) {
        logger.warn(`Cannot get disk space: ${err}`);
      } else {
        logger.debug(
          `Disk[${directory}] Total=${info.total}, Available=${info.available}, Used=${info.used}`,
        );
        logger.debug(`Start to list a files in ${directory}`);
        dirTree(directory, undefined, (item: IDirTreeItem) => {
          logger.debug(item.path);
        });
        resolve();
      }
    });
  });
