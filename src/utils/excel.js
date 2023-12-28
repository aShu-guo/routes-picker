import { utils, writeFileXLSX } from 'xlsx';

/**
 *
 * @param json array
 * @param fileName xlsx文件
 */
export const exportExcel = (json, fileName = new Date().getTime() + '.xlsx') => {
  const worksheet = utils.json_to_sheet(json);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, '经纬度');
  writeFileXLSX(workbook, fileName, { compression: true });
};
