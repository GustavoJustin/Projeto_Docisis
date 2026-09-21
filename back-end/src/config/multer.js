const multer = require('multer')
const path = require('path')
const fileSistem = require('fs')

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads')
if(!fileSistem.existsSync(uploadFolder)) {
    fileSistem.mkdirSync(uploadFolder, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, uploadFolder)
    },

    filename: (req, file, cd) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cd(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const fileFilter = (req, file, cd) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/webp']

    if (allowedMimes.includes(file.mimetype)) {
        cd(null, true)
    } else {
        cd(new Error('Tipo de arquivo inválido. Apenas imagens são permitidas'))
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024}
})

module.exports = upload