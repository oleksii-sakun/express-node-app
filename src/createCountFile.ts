import * as fs from "fs";
import path from "path";

export const createCountFile = (): void => {
  const baseDir: string = path.join(process.cwd(), 'db');
  const filePath: string = path.join(baseDir, '.count.txt');
  console.log(baseDir);

  fs.access(filePath, error => {
    if (!error) {
      console.log('file exists');
    } else {
      fs.mkdir(baseDir, {recursive:true}, (err)=>{
        if (err) console.log(`Error creating directory: ${err}`);
        else console.log('Directory created successfully.');
      });
      fs.writeFile(filePath, '0',(err)=> {
        if (err) console.log(`Error creating file: ${err}`);
        else console.log('File created successfully.');
      });
    }
  });
};
