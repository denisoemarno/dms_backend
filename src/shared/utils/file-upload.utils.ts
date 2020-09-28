import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
};

export const documentFileFilter = (req, file, callback) => {
    //console.log('dewa', file);
    if (!file.originalname.match(/\.(doc|docx|pdf|xlsx|xls)$/)) {
        return callback(new Error('Only document files are allowed!'), false);
    }
    callback(null, true);
};

export const documentFilesFilter = (req, file, callback) => {
    let files: any;
    files = file;
    console.log('===>>>', files.originalname);
    if (file.length > 0) {
        for (let i = 0; i < file.length; i++) {
            if (!file[i].originalname.match(/\.(doc|docx|pdf|xlsx|xls)$/)) {
                return callback(
                    new Error('Only document files are allowed!'),
                    false,
                );
            }
        }
        // console.log('dewa', file);
    } else {
        console.log('dewa 1', file.length);
    }

    // if (!file.originalname.match(/\.(doc|docx|pdf|xlsx|xls)$/)) {
    //     return callback(new Error('Only document files are allowed!'), false);
    // }
    callback(null, true);
};

export const editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
