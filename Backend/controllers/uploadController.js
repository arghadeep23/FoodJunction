const { generateUploadURL } = require('../config/aws');

exports.getUploadUrl = async (req, res) => {
    const url = await generateUploadURL('image/jpeg');
    res.json({ url });
};
