import express from 'express';
import { protect } from '../middlewares/auth.js';
import { addStory, getStory } from '../controllers/storyController.js';
import { upload } from '../config/multer.js';

const storyRouter = express.Router();

storyRouter.post('/create',upload.single('media'),protect,addStory);
storyRouter.get('/get',protect,getStory);

export default storyRouter;