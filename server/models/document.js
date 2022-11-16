const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        content: { type: String, required: false} 
    },
    { timestamps: true },
    { collection: 'documents' },
);

module.exports = mongoose.model('Document', documentSchema);