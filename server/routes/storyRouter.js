import express from 'express';
import { upload } from '../config/.js';
import { protect } from '../middlewares/auth.js';
import { addStory, getStory } from '../controllers/storyController';

const storyRouter = express.Router();

storyRouter.post('/create',upload.single('media'),protect,addStory);
storyRouter.get('/get',protect,getStory);

export default storyRouter;