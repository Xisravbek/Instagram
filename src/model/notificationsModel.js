const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // Тип уведомления, например, "like", "comment", "follow"
    message: { type: String, required: true }, // Сообщение уведомления
    read: { type: Boolean, default: false }, // Флаг прочтения
    createdAt: { type: Date, default: Date.now } // Дата создания
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;