import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';

const upload = multer({
    dest: 'uploads/',
});

