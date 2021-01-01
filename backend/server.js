import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import config from './config';
import userRoute from './routes/userRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';
import uploadRoute from './routes/uploadRoute';

const mongodbUrl = config.MONGODB_URL;
mongoose
  .connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.reason));

const app = express();
app.use(bodyParser.json());
app.use('/api/uploads', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.get('/api/config/paypal', (req, res) => {
  res.send(config.PAYPAL_CLIENT_ID);
});
app.post('/api/image/upload', async (req, res) => {
    try {
        const fileStr = req.body.data;
        const uploadResponse = await cloudinary.uploader.upload(fileStr, {
            upload_preset: 'manga',
        });
        //console.log(uploadResponse);
        res.json({ msg: uploadResponse });
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use('/product', express.static(path.join(__dirname, '/../frontend/public')));
app.use('/order', express.static(path.join(__dirname, '/../frontend/public')));
app.use('/cart', express.static(path.join(__dirname, '/../frontend/public')));
app.use('/admin', express.static(path.join(__dirname, '/../frontend/public')));
app.use(express.static(path.join(__dirname, '/../frontend/public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/public/index.html`));
});

app.listen(config.PORT, () => {
  console.log('Server started at http://localhost:5000');
});
